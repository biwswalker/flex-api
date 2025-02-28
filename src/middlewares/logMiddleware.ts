import fs from "fs";
import path from "path";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

export function logResponseBody(
  req: Request,
  res: Response,
  next: NextFunction
) {
  convertRequest(req, res)
    .then(() => next())
    .catch((error) => next(error));
}

async function convertRequest(req: Request, res: Response) {
  console.log(
    `${_getDateTime()} ${req.method} ${req.url} : ${JSON.stringify(req.body)}`
  );

  const ip = req.header("x-forwarded-for") || req.socket.remoteAddress;
  const pathArray = req.url.split("/");
  let logData = {
    timeStamp: _getDateTime(),
    logLevel: process.env.LOG_LEVEL || "INFO",
    IPAddress: ip,
    logSystem: process.env.LOG_SYSTEM || "app",
    user: "system",
    module: pathArray[pathArray.length - 2] || "unknown",
    subModule: pathArray[pathArray.length - 1] || "unknown",
    httpStatusCode: 200,
    httpMethod: req.method,
    logMessage: "success",
    responseTime: "",
    responseSize: "",
    requestParams: JSON.stringify(req.body),
    response: "",
  };

  const startTime = process.hrtime();
  let responseSize = 0;

  const captureResponseBody = (body: any) => {
    if (body) {
      if (Buffer.isBuffer(body)) responseSize = body.length;
      else if (typeof body === "string") responseSize = Buffer.byteLength(body);
      else if (typeof body === "object")
        responseSize = Buffer.byteLength(JSON.stringify(body));
    }
  };

  const oldSend = res.send as (body?: any) => any;
  res.send = function (data: any): any {
    captureResponseBody(data);
    (res as any).body = data;
    return oldSend.call(res, data);
  };

  res.on("finish", () => {
    const diff = process.hrtime(startTime);
    logData.responseTime = `${(diff[0] * 1e9 + diff[1]) / 1e6} ms`;
    logData.responseSize = `${responseSize} bytes`;
    logData.httpStatusCode = res.statusCode;
    logData.logMessage = res.statusMessage || "OK";

    if (process.env.SHOW_RESPONSE_BODY === "true") {
      logData.response = (res as any).body;
    }

    writeLogToFile(logData);
  });
}

function writeLogToFile(logData: any) {
  const system = process.env.LOG_SYSTEM || "app";
  const logDir = path.join(__dirname, "../../logs");

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const logFileName = path.join(
    logDir,
    `log_${system}_${new Date().toISOString().split("T")[0]}.log`
  );
  fs.appendFile(logFileName, JSON.stringify(logData) + "\n", (err) => {
    if (err) console.error("Error writing log to file", err);
  });
}

function _getDateTime(): string {
  const date = new Date();
  return `${date.toISOString().split("T")[0]} ${date.toLocaleTimeString()}`;
}
