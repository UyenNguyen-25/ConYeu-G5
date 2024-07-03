import mongoose from "mongoose";

export interface UserInterface {
  user_id: mongoose.Types.ObjectId;
  user_fullname: string;
  user_password: string;
  user_email: string;
  user_phoneNumber: string;
  user_role: "admin" | "manager" | "staff";
  address: string;
  default: boolean;
  user_status: boolean;
}

export interface UserAddressInterface {
  user_id: string;
  fullname: string;
  phoneNumber: string;
  address: string;
  default: boolean;
}
