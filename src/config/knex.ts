import { knex, type Knex } from "knex";
import dotenv from "dotenv";

dotenv.config();

const config: Knex.Config = {
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 5432,
  },
  pool: {
    idleTimeoutMillis: 600000,
    propagateCreateError: false,
  },
  migrations: {
    directory: "./migrations",
  },
  seeds: {
    directory: "./seeds",
  },
};

const db = knex(config);

export default db;

export async function testConnection() {
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