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

let db: Knex | null = null;

function dbConnection() {
  if (db) {
    db.destroy();
  }
  db = knex(config);
  return db;
}

export default dbConnection;

export async function dbTransaction() {
  const database = dbConnection();
  const transaction = await database.transaction();
  return { transaction, database };
}

export async function testConnection() {
  const { transaction, database } = await dbTransaction();
  try {
    await transaction.raw("SELECT 1");
    transaction.commit();
    console.log(`✅ Database ${process.env.DB_NAME} connected successfully!`);
  } catch (error: any) {
    transaction.rollback(error);
    console.error(
      `❌ Database ${process.env.DB_NAME} connection failed:`,
      error
    );
  } finally {
    await database.destroy(); // ปิด connection หลังจากทดสอบเสร็จ
  }
}
