import { Router } from "express";
import { taskRouter } from "./task.route.js";

export const router = Router();

router.use("/tasks", taskRouter);
