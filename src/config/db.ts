import knex from "knex";
import knexConfig from "../config/knexfile";

const db = knex(knexConfig);

async function testConnection() {
  try {
    const transaction = await db.transaction(async trx => {
      await trx.raw("SELECT 1");
      return true
    })
    if(transaction) {
      console.log(`✅ Database ${process.env.DB_NAME} connected successfully!`);
    } else {
      console.log(`🅾️ Database ${process.env.DB_NAME} connected but got an error!`);
    }
  } catch (error:any) {
    console.error(`❌ Database ${process.env.DB_NAME} connection failed:`, error);
  } finally {
    await db.destroy(); // ปิด connection หลังจากทดสอบเสร็จ
  }
}

testConnection();

export default db;
