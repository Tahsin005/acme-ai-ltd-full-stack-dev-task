import { z } from "zod";

const PRIORITIES = ["low", "medium", "high"] as const;
const STATUSES = ["pending", "in_progress", "completed"] as const;

export const createTaskSchema = z.object({
    title: z.string().min(1, "Title is required").max(255),
    description: z.string().optional(),
    priority: z.enum(PRIORITIES).optional(),
    status: z.enum(STATUSES).optional(),
});

export const updateTaskSchema = z.object({
    title: z.string().min(1, "Title is required").max(255).optional(),
    description: z.string().optional(),
    priority: z.enum(PRIORITIES).optional(),
    status: z.enum(STATUSES).optional(),
});

export const taskIdParamSchema = z.object({
    id: z.coerce.number().int().positive("Task ID must be a positive integer"),
});
