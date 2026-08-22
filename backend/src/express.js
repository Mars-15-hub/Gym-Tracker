import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import logger from "morgan";
import helmet from "helmet";
import { errorHandler } from "./middleware/errorHandler.js";
import { router as route } from "./route/index.js";
dotenv.config();

export const app = express();

if (process.env.NODE_ENV !== "test") {
  app.use(logger("dev", { immediate: true }));
}

app.use(helmet());

app.disable("x-powered-by");

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(route);

app.use(errorHandler.notFoundDefault);

app.use(errorHandler.errorDefault);
