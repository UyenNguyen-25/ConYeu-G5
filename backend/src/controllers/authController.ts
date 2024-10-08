require("dotenv").config();
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { UserInterface } from "../service/userInterface";
import UserAddress from "../models/UserAddress";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "";

const login: RequestHandler = asyncHandler(async (req, res): Promise<any> => {
  const { user_phoneNumber, user_password }: UserInterface = req.body;

  if (!user_phoneNumber || !user_password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const foundUser = await User.findOne({ user_phoneNumber })
    .populate("user_role", "role_description-_id")
    .lean();

  if (!foundUser || foundUser.user_status === false) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  bcrypt.compare(
    user_password,
    foundUser?.user_password as string,
    async (err, response) => {
      if (!response) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const accessToken = jwt.sign(
        {
          UserInfo: {
            user_phoneNumber: foundUser.user_phoneNumber,
            user_fullname: foundUser.user_fullname,
            user_role: foundUser?.user_role,
            user_id: foundUser?._id
          },
        },
        ACCESS_TOKEN_SECRET,
        { expiresIn: "10m" }
      );
      const refreshToken = jwt.sign(
        { user_phoneNumber: foundUser.user_phoneNumber },
        REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );

      // Create secure cookie with refresh token
      res.cookie("jwt", refreshToken, {
        httpOnly: true, //accessible only by web server
        secure: true, //https
        sameSite: "none", //cross-site cookie
        maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
      });

      // Send accessToken containing username and roles
      res.json({ accessToken });
    }
  );
});

const refresh: RequestHandler = asyncHandler(async (req, res): Promise<any> => {
  const cookies = req.cookies;
  console.log("req.cookies: ", req.cookies);

  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    REFRESH_TOKEN_SECRET,
    async (err: any, decoded: any) => {
      if (err) return res.status(403).json({ message: "Forbidden" });
      console.log("decoded: ", decoded);

      const foundUser = await User.findOne({
        user_phoneNumber: decoded.user_phoneNumber,
      })
        .populate("user_role", "role_description-_id")
        .lean();

      if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

      const accessToken = jwt.sign(
        {
          UserInfo: {
            user_phoneNumber: foundUser.user_phoneNumber,
            user_fullname: foundUser.user_fullname,
            user_role: foundUser?.user_role,
            user_id: foundUser?._id
          },
        },
        ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      res.json({ accessToken });
    }
  );
});

const forgotPassword: RequestHandler = asyncHandler(
  async (req, res): Promise<any> => {
    const { user_phoneNumber, user_password }: UserInterface = req.body;

    if (!user_phoneNumber && !user_password) {
      return res
        .status(400)
        .json({ message: "phoneNumber, password are required" });
    }

    //check duplicate
    const foundPhone = await User.findOne({
      user_phoneNumber: user_phoneNumber,
    }).exec();

    if (!foundPhone) {
      return res.status(400).json({ message: "phoneNumber doesn't existed" });
    }

    if (user_password && user_password.length > 0) {
      foundPhone.user_password = await bcrypt.hash(user_password, 10);
    } else foundPhone.user_password = foundPhone.user_password;

    foundPhone.save();

    return res.status(200).json({
      message: `${user_phoneNumber} updated success`,
    });
  }
);

const signup: RequestHandler = asyncHandler(async (req, res): Promise<any> => {
  const requestUser: UserInterface = req.body;

  //confirm data
  if (!requestUser.user_phoneNumber || !requestUser.user_password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  //check duplicate
  const duplicate = await User.findOne({
    user_phoneNumber: requestUser.user_phoneNumber,
  })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: "Phone number existed" });
  }

  //hash password
  const hashedPwd = await bcrypt.hash(requestUser.user_password, 10);

  //create new user address
  const userAddress = await UserAddress.create({
    fullname: requestUser.user_fullname || "",
    phoneNumber: requestUser.user_phoneNumber,
  });

  //create and store new user
  const user = await User.create({
    user_phoneNumber: requestUser.user_phoneNumber,
    user_password: hashedPwd,
    address_id: userAddress._id,
  });
  if (user) {
    res
      .status(200)
      .json({ message: `${requestUser.user_phoneNumber} create success` });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
});

const logout: RequestHandler = asyncHandler(async (req, res): Promise<any> => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
  res.json({ message: "Cookie cleared" });
});

const authController = { login, refresh, forgotPassword, logout, signup };

export default authController;
