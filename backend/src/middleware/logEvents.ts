import { NextFunction, Request, Response } from "express";

const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

export const logEvents = async (message: String, file: String) => {
  const dateTime = `${format(new Date(), "yyyMMdd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
  console.log(logItem);
  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    } else {
      await fsPromises.appendFile(
        path.join(__dirname, "..", "logs", file),
        logItem
      );
    }
  } catch (err) {
    console.log(err);
  }
};

export const logger = (req: Request, res: Response, next: NextFunction) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqLog.txt");
  console.log(`${req.method} ${req.path}`);
  next();
};

module.exports = { logger, logEvents };
