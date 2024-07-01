import { NextFunction } from "express";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "";

const verifyJWT = (req: any, res: any, next: NextFunction) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err: any, decoded: any) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user_phoneNumber = decoded.UserInfo.user_phoneNumber;
    req.user_fullname = decoded.UserInfo.user_fullname;
    req.user_role = decoded.UserInfo.user_role;
    next();
  });
};

export default verifyJWT;
