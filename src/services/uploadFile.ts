// src/services/fileService.ts
import path from "path";
import fs from "fs";
import { IMG_URL, IMG_PATH } from "../config/imageConfig"; // ใช้ค่าคอนฟิกจาก config.ts

// ฟังก์ชันในการอัพโหลดไฟล์
export const uploadFile = async (
  uploadfile: any,
  route: string
): Promise<string> => {
  // ตรวจสอบประเภทของไฟล์
  const filetype = uploadfile.name.split(".").pop().toLowerCase();
  const image_type = ["jpg", "jpeg", "tif", "png", "pic", "gif", "eps", "raw"];

  if (image_type.indexOf(filetype) === -1) {
    throw new Error("File type not supported");
  }

  // สร้างชื่อไฟล์ใหม่
  const imgname = new Date().getTime();
  const directoryPath = path.join(IMG_PATH, route);

  // ตรวจสอบว่ามีโฟลเดอร์อยู่แล้วหรือไม่ ถ้าไม่มีให้สร้าง
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  const filePath = path.join(directoryPath, `${imgname}.${filetype}`);

  // อัพโหลดไฟล์ไปยังโฟลเดอร์ที่กำหนด
  await uploadfile.mv(path.join(IMG_PATH, route, `${imgname}.${filetype}`));

  // คืนค่าพาธของไฟล์ที่อัพโหลด
  return `/${IMG_URL}/${route}/${imgname}.${filetype}`;
};
