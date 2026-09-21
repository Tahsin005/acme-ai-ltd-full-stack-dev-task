import type { RequestHandler } from "express";
import { taskController } from "../controllers/task.controller.js";
import { successResponse } from "../utils/response.js";

export const taskHandler = {
    getAll: (async (_req, res, next) => {
        try {
            const tasks = await taskController.getAll();
            res.json(successResponse(tasks, "Tasks retrieved successfully"));
        } catch (error) {
            next(error);
        }
    }) as RequestHandler,

    getById: (async (req, res, next) => {
        try {
            const task = await taskController.getById(req.params);
            res.json(successResponse(task, "Task retrieved successfully"));
        } catch (error) {
            next(error);
        }
    }) as RequestHandler,

    create: (async (req, res, next) => {
        try {
            const task = await taskController.create(req.body);
            res.status(201).json(successResponse(task, "Task created successfully"));
        } catch (error) {
            next(error);
        }
    }) as RequestHandler,

    update: (async (req, res, next) => {
        try {
            const task = await taskController.update(req.params, req.body);
            res.json(successResponse(task, "Task updated successfully"));
        } catch (error) {
            next(error);
        }
    }) as RequestHandler,

    delete: (async (req, res, next) => {
        try {
            const task = await taskController.delete(req.params);
            res.json(successResponse(task, "Task deleted successfully"));
        } catch (error) {
            next(error);
        }
    }) as RequestHandler,
};
