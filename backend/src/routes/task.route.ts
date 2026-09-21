import { Router } from "express";
import { taskHandler } from "../handlers/task.handler.js";

export const taskRouter = Router();

taskRouter.get("/", taskHandler.getAll);
taskRouter.get("/:id", taskHandler.getById);
taskRouter.post("/", taskHandler.create);
taskRouter.patch("/:id", taskHandler.update);
taskRouter.delete("/:id", taskHandler.delete);
