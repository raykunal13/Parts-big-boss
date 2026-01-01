import jwt from "jsonwebtoken";

const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_ACCESS_TOKEN, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_TOKEN, {
    expiresIn: "7d",
  });
};

export { generateAccessToken, generateRefreshToken };