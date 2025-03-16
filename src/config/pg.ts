import { Pool, PoolConfig } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pgClientConfig: PoolConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 5432,
}

const pg = new Pool(pgClientConfig);

export async function testConnection() {
    try {
        const query = "SELECT 1"
        await pg.query(query)
        console.log(`📄 Database connected to ${process.env.DB_NAME}`);
    } catch (error) {
        console.log(`❌ Database connected error:`, error);
    }
}

export default pg;
