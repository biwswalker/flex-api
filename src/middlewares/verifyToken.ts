import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = (req: any, res: any, next: any) => {
  const token = req.headers['authorization']?.split(' ')[1]; // รับ Token จาก Authorization Header (Bearer <Token>)

  if (!token) {
    return res.status(401).send({
      success: false,
      code: 401,
      message: "ไม่สามารถใช้งานได้ เนื่องจากต้องลงชื่อเข้าใช้อีกครั้ง",
      data: null
    });
  }

  try {
    // ตรวจสอบ Token โดยใช้ Secret Key ของคุณ
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded; // เก็บข้อมูลผู้ใช้ที่ได้จาก Token ใน req.user
    next(); // ถ้า Token ถูกต้อง จะไปต่อยัง controller
  } catch (error) {
    return res.status(401).send({
      success: false,
      code: 401,
      message: "Token ไม่ถูกต้องหรือหมดอายุ",
      data: null
    });
  }
};
