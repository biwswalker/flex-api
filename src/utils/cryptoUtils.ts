import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const AES_SECRET_KEY = process.env.AES_SECRET_KEY!;
const AES_SECRET_IV = process.env.AES_SECRET_IV!;

export const decryptAES256 = (encryptedText: string): string => {
  // แปลงจาก Base64 เป็น Buffer
  const encryptedBuffer = Buffer.from(encryptedText, "base64");

  const key = Buffer.from(AES_SECRET_KEY, "utf8");
  const iv = Buffer.from(AES_SECRET_IV, "utf8");

  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

  // ถอดรหัส (update) โดยการส่งค่า Buffer
  let decrypted = decipher.update(encryptedBuffer, undefined, "utf8");

  // ถอดรหัส (final) และรวมค่าเป็น string
  decrypted += decipher.final("utf8");

  return decrypted;
};
