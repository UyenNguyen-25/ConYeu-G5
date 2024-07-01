import { logEvents } from "./logEvents";
import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logEvents(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}\n`,
    "errLog.og"
  );
  console.log(err.stack);

  const status: number = res.statusCode ? res.statusCode : 500; //Server error

  res.status(status);

  res.json({ message: err.message });
};
