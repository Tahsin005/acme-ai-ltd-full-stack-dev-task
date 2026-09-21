import type { z } from "zod";
import type { Task } from "../db/schema/index.js";
import type {
    createTaskSchema,
    updateTaskSchema,
    taskIdParamSchema,
} from "../validators/task.validator.js";

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskIdParam = z.infer<typeof taskIdParamSchema>;

export type { Task };
