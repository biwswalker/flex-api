import knex from "knex";
import knexConfig from "../config/knexfile";

const db = knex(knexConfig.development);

async function testConnection() {
  try {
    await db.raw("SELECT 1");
    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  } finally {
    await db.destroy(); // ปิด connection หลังจากทดสอบเสร็จ
  }
}

testConnection();

export default db;
