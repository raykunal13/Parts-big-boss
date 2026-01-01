// server/middleware/authMiddleware.js
import redisClient from "../db/redisClient.js"; // Import your redis client
import AppError from "../utils/appError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { pool } from "../db/db.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token = req.cookies._access || req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new AppError("Not authorized, no token", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);

    const cacheKey = `session:${decoded.id}`;
    const cachedUser = await redisClient.get(cacheKey);

    if (cachedUser) {
      req.user = JSON.parse(cachedUser);
      return next(); // <--- EXIT EARLY, NO DB CALL
    }

    const { rows } = await pool.query(
      "SELECT id, email, role FROM users WHERE id = $1",
      [decoded.id]
    );

    if (rows.length === 0) {
      throw new AppError("User not found", 401);
    }

    await redisClient.set(cacheKey, JSON.stringify(rows[0]), "EX", 3600);

    req.user = rows[0];
    next();
  } catch (error) {
    throw new AppError("Not authorized", 401);
  }
});
