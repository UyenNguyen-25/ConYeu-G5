require("dotenv").config();
import mongoose from "mongoose";

const MONGO_USERNAME = process.env.MONGO_USERNAME || "";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "";
const MONGO_URL = process.env.MONGO_URL || "";
const MONGO_DATABASE = process.env.MONGO_DATABASE || "";
const MONGO_OPTIONS: mongoose.ConnectOptions = {
  retryWrites: true,
  w: "majority",
  appName: "Conyeu",
};

const connect = async () => {
  try {
    const uri = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_URL}/${MONGO_DATABASE}?`;
    await mongoose.connect(uri, MONGO_OPTIONS);
    console.log("Connect success");
  } catch (error) {
    console.log("Connect fail");
    console.log(error);
  }
};

const database = { connect };
export default database;
