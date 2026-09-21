import { ZodError } from "zod";
import { AppError } from "../utils/app-error.js";
import { errorResponse } from "../utils/response.js";
import type { ErrorRequestHandler } from "express";

export const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
    if (err instanceof ZodError) {
        res.status(400).json(errorResponse("Validation failed", err.issues));
        return;
    }
    if (err instanceof AppError) {
        res.status(err.statusCode).json(errorResponse(err.message));
        return;
    }
    console.error(err);
    res.status(500).json(errorResponse("Internal server error"));
};