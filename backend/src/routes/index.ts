import { Router } from "express";
import { taskRouter } from "./task.route.js";
import { stripeRouter } from "./stripe.route.js";

export const router = Router();

router.use("/tasks", taskRouter);
router.use("/", stripeRouter);
