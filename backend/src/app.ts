import express, { Application, Request, Response } from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import database from "./config/db";
import { logger } from "./middleware/logEvents";
import { errorHandler } from "./middleware/errorHandler";
import { corsOption } from "./config/corsOption";
import router from "./routes/root";
import bodyParser from "body-parser";

dotenv.config();

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 5000;
const HOSTNAME: string = process.env.HOSTNAME || "localhost";

database.connect();

app.use(logger);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// app.use(bodyParser.json({ limit: "10mb" }));

// app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use(cookieParser());

app.use(cors<Request>(corsOption));

app.use("/", express.static(path.join(__dirname, "assets")));

app.use("/", router);

app.all("*", (req: Request, res: Response) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

app.listen(PORT, HOSTNAME, () => {
  console.log(`Server running on http://${HOSTNAME}:${PORT}`);
});

export default app;
