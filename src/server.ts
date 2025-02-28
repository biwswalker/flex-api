// src/server.ts
import app from "./app";
import fs from "fs";
import https from "https";
import dotenv from "dotenv";
import "./config/db"; // เพิ่มบรรทัดนี้เพื่อให้ db.ts รันตอน server.ts ทำงาน

dotenv.config();

const PORT = process.env.PORT || 3000;
const API_TYPE = process.env.API_TYPE;

if (API_TYPE === "HTTP" || API_TYPE === "cleavr") {
  // HTTP server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
} else if (API_TYPE === "HTTPS") {
  // HTTPS server
  const options = {
    key: fs.readFileSync(
      "/usr/local/directadmin/data/users/admin/domains/appsmez-booking.com.key"
    ),
    cert: fs.readFileSync(
      "/usr/local/directadmin/data/users/admin/domains/appsmez-booking.com.cert"
    ),
    ca: fs.readFileSync(
      "/usr/local/directadmin/data/users/admin/domains/appsmez-booking.com.cacert"
    ),
  };

  const server = https.createServer(options, app);
  server.listen(PORT, () => {
    console.log(`Server running on https://localhost:${PORT}`);
  });
}
