import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!;

export const generateAccessToken = (
  data: object,
  expiresIn: object = { expiresIn: "24h" }
): any => {
  return jwt.sign(data, JWT_SECRET_KEY, expiresIn);
};
