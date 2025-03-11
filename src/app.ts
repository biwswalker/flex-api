import express from "express";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import routes from "./routes";
import _ from "lodash"; // ใช้สำหรับ Utility functions
import { logResponseBody } from "./middlewares/logMiddleware";
import dotenv from "dotenv";
import "./config/db"; // Import db.ts จะทำให้ฟังก์ชันทดสอบรันอัตโนมัติ

dotenv.config();

const app = express();

// **** Enable files upload
app.use(fileUpload({ createParentPath: true }));

// **** Helmet configuration for security
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'"],
        "base-uri": ["'self'"],
        "font-src": ["'self'", "https:", "data:"],
        "form-action": ["'self'"],
        "frame-ancestors": ["'self'"],
        "img-src": ["'self'", "data:"],
        "object-src": ["'none'"],
        "script-src": [
          "'self'",
          "'unsafe-inline'",
          "cdnjs.cloudflare.com",
          "cdn.datatables.net",
        ],
        "script-src-attr": ["'unsafe-inline'"],
        "style-src": ["'self'", "https:", "'unsafe-inline'"],
        "upgrade-insecure-requests": [],
      },
    },
  })
);

// **** CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // หรือจำกัดเฉพาะ domain ที่ต้องการ
  res.header("Access-Control-Allow-Methods", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,x-access-token"
  );
  next();
});

// **** Other middleware
app.use(cors({ origin: true, credentials: true }));
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// **** Logging middleware
app.use(logResponseBody);

// **** Test route
app.get("/", (req, res) => {
  const fs = require("fs");
  const pathToFile = __dirname + "/index.html";
  fs.access(pathToFile, fs.constants.F_OK, (err: any) => {
    if (err) {
      res.send("Hello API Express!");
    } else {
      res.sendFile(pathToFile);
    }
  });
  console.log("Hello API Express!");
});

// นำ routes ที่สร้างไว้มาใช้
app.use("/api", routes);

// Export app object สำหรับนำไปใช้ใน server.ts
export default app;
