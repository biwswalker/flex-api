import CryptoJS from 'crypto-js'
import dotenv from "dotenv";

dotenv.config();

const AES_SECRET_KEY = process.env.AES_SECRET_KEY!;
const AES_SECRET_IV = process.env.AES_SECRET_IV!;

export function encryption(encryptext: string) {
  const text = CryptoJS.AES.encrypt(encryptext, process.env.AES_SECRET_KEY).toString()
  return text || ''
}

export function decryption(decryptext: string) {
  const text = CryptoJS.AES.decrypt(decryptext, process.env.AES_SECRET_KEY).toString(CryptoJS.enc.Utf8)
  return text || ''
}
