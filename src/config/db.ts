import knex from "knex";
import knexConfig from "../config/knexfile";

const db = knex(knexConfig.development);

async function testConnection() {
  try {
    await db.raw("SELECT 1");
    console.log(`✅ Database ${process.env.DB_NAME} connected successfully!`);
  } catch (error:any) {
    console.error(`❌ Database ${process.env.DB_NAME} connection failed:`, error);
  } finally {
    await db.destroy(); // ปิด connection หลังจากทดสอบเสร็จ
  }
}

testConnection();

export default db;
