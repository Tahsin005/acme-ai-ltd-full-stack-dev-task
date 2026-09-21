import { errorMiddleware } from "./middlewares/error.middleware.js";
import { router } from "./routes/index.js";
import express, { type Express } from "express";
import morgan from "morgan";
import cors from "cors";

export const app: Express = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api", router);

app.use(errorMiddleware);