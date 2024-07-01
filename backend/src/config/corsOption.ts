import { CorsOptions } from "cors";
import { allowedOrigins } from "./allowedOrigin";

export const corsOption: CorsOptions = {
  origin: (origin: any, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: [
    "Content-Type",
    "Access-Control-Allow-Credentials",
    "Authorization" || "authorization",
  ],
};
