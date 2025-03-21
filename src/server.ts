import app from "./app";
import dotenv from "dotenv";
import { databaseMigration, testConnection } from '@config/knex'

dotenv.config();

const environment = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`✈️ Server is running on http://localhost:${PORT}`);
  await testConnection()
  if(environment === 'production') {
    await databaseMigration()
  }
});