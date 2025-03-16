import knex from "knex";
import knexConfig from "../config/knexfile";

const db = knex(knexConfig);

async function testConnection() {
  const transaction = await db.transaction()
  try {
    await transaction.raw("SELECT 1");
    console.log(`✅ Database ${process.env.DB_NAME} connected successfully!`);
  } catch (error:any) {
    await transaction.rollback();
    console.error(`❌ Database ${process.env.DB_NAME} connection failed:`, error);
  } finally {
    await db.destroy(); // ปิด connection หลังจากทดสอบเสร็จ
  }
}

testConnection();

export default db;
