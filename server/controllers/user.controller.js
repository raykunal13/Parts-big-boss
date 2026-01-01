import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import asyncHandler from "../utils/asyncHandler.js";
import { pool } from "../db/db.js";
import redisClient from "../db/redisClient.js";
import AppError from "../utils/appError.js";
import { 
  generateAccessToken, 
  generateRefreshToken 
} from "../utils/generateToken.js"; 
import { cookieOptions } from "../utils/cookieOptions.js";


const sendTokenResponse = async (user, statusCode, res) => {
  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  const sessionData = {
    id: user.id,
    email: user.email,
    role: user.role,
    is_verified: user.is_verified,
  };
  
  await redisClient.set(
    `session:${user.id}`,
    JSON.stringify(sessionData),
    "EX",
    3600 // 1 Hour
  );

  await redisClient.set(
    `refresh_token:${refreshToken}`,
    user.id.toString(),
    "EX",
    604800 // 7 Days (Must match token expiry)
  );

  res.cookie("_access", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 }); // 15 mins
  res.cookie("_refresh", refreshToken, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    accessToken,
    data: {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      phone_number: user.phone_number,
      dealer_profile: user.dealer_profile || null
    },
  });
};





export const registerUser = asyncHandler(async (req, res) => {
  const { 
    email, phone_number, first_name, last_name, password, role,
    company_name, vat_number, company_address, company_city
  } = req.body;

  // 1. Validation
  if (!email || !phone_number || !first_name || !last_name || !password || !role) {
    throw new AppError("All common fields are required", 400);
  }

  const validRoles = ['customer', 'dealer'];
  if (!validRoles.includes(role)) {
    throw new AppError("Invalid role specified", 400);
  }

  if (role === "dealer") {
    if (!company_name || !vat_number || !company_address || !company_city) {
      throw new AppError("All dealer fields are required", 400);
    }
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // Start Transaction

    // 2. Check Exists
    const userCheck = await client.query("SELECT id FROM users WHERE email = $1", [email]);
    if (userCheck.rows.length > 0) {
      throw new AppError("Email already registered", 400);
    }

    // 3. Create User
    const hashedPassword = await bcrypt.hash(password, 10);
    const userQuery = `
      INSERT INTO users (email, phone_number, first_name, last_name, password_hash, role) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING id, email, first_name, last_name, role, phone_number, created_at`; 
    
    const userResult = await client.query(userQuery, [
      email, phone_number, first_name, last_name, hashedPassword, role
    ]);
    const newUser = userResult.rows[0];

    // 4. Create Dealer Profile (if needed)
    if (role === "dealer") {
      const dealerQuery = `
        INSERT INTO dealers (user_id, company_name, vat_number, company_address, company_city) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING *`;
      
      const dealerResult = await client.query(dealerQuery, [
        newUser.id, company_name, vat_number, company_address, company_city
      ]);
      newUser.dealer_profile = dealerResult.rows[0];
    }

    await client.query('COMMIT'); // Commit Transaction

    // 5. Generate Tokens & Response
    await sendTokenResponse(newUser, 201, res);

  } catch (error) {
    await client.query('ROLLBACK'); // Rollback on error
    
    // Handle Postgres Unique Constraint Errors
    if (error.code === '23505') { 
      if (error.detail.includes('email')) throw new AppError("Email already exists", 400);
      if (error.detail.includes('vat_number')) throw new AppError("VAT Number already registered", 400);
    }
    throw error;
  } finally {
    client.release();
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Fetch User & Password Hash
    const userCheck = await client.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userCheck.rows.length === 0) {
      throw new AppError("Invalid email or password", 401);
    }
    
    const user = userCheck.rows[0];

    // 2. Verify Password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    // 3. Fetch Dealer Profile (if needed)
    if (user.role === "dealer") {
      const dealerData = await client.query("SELECT * FROM dealers WHERE user_id = $1", [user.id]);
      user.dealer_profile = dealerData.rows[0];
    }

    await client.query('COMMIT');

    // 4. Generate Tokens & Response
    await sendTokenResponse(user, 200, res);

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies._refresh;

  if (!refreshToken) {
    throw new AppError("No refresh token provided", 401);
  }

  // 1. Verify JWT Signature
  let decoded;
  try {
    // IMPORTANT: Must use JWT_REFRESH_SECRET
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    throw new AppError("Invalid refresh token", 403);
  }

  // 2. Redis Whitelist Check
  // If the token is not in Redis, it might have been logged out/revoked
  const storedUserId = await redisClient.get(`refresh_token:${refreshToken}`);

  if (!storedUserId || storedUserId !== decoded.id.toString()) {
    throw new AppError("Token expired or revoked", 403);
  }

  // 3. Issue New Access Token
  const newAccessToken = generateAccessToken(storedUserId);
  const newRefreshToken = generateRefreshToken(storedUserId);

  // 4. Send via Cookie and JSON
  res.cookie("_access", newAccessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.cookie("_refresh", newRefreshToken, cookieOptions);
  
  res.status(200).json({
    status: "success",
    accessToken: newAccessToken
  });
});

export const logoutUser = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies._refresh;
  const userId = req.user?.id; // From authMiddleware (if protected route)

  if (refreshToken) {
    // 1. Revoke Refresh Token (Remove from Redis)
    await redisClient.del(`refresh_token:${refreshToken}`);
  }

  // 2. Optional: Kill the session cache immediately
  if (userId) {
    await redisClient.del(`session:${userId}`);
  }

  // 3. Clear Cookies
  res.clearCookie("_refresh", cookieOptions);
  res.clearCookie("_access", cookieOptions);

  res.status(200).json({ status: "success", message: "Logged out successfully" });
});


export const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const user = await pool.query("SELECT id,email,first_name,last_name FROM users WHERE id = $1", [userId]);
  res.status(200).json(user.rows[0]);
});