import app from "./app";
import dotenv from "dotenv";
import { testConnection } from '@config/knex'

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`✈️ Server is running on http://localhost:${PORT}`);
  await testConnection()
});