import { taskRepository } from "../repositories/task.repository.js";
import { AppError } from "../utils/app-error.js";
import {
    createTaskSchema,
    updateTaskSchema,
    taskIdParamSchema,
} from "../validators/task.validator.js";
import type { CreateTaskInput, UpdateTaskInput, Task } from "../types/task.types.js";

export const taskController = {
    async getAll(): Promise<Task[]> {
        return taskRepository.findAll();
    },

    async getById(rawId: unknown): Promise<Task> {
        const { id } = taskIdParamSchema.parse(rawId);
        const task = await taskRepository.findById(id);
        if (!task) {
            throw new AppError(404, `Task with id ${id} not found`);
        }
        return task;
    },

    async create(body: unknown): Promise<Task> {
        const data: CreateTaskInput = createTaskSchema.parse(body);
        return taskRepository.create(data);
    },

    async update(rawId: unknown, body: unknown): Promise<Task> {
        const { id } = taskIdParamSchema.parse(rawId);
        const data: UpdateTaskInput = updateTaskSchema.parse(body);

        if (Object.keys(data).length === 0) {
            throw new AppError(400, "At least one field is required to update");
        }

        const task = await taskRepository.update(id, data);
        if (!task) {
            throw new AppError(404, `Task with id ${id} not found`);
        }
        return task;
    },

    async delete(rawId: unknown): Promise<Task> {
        const { id } = taskIdParamSchema.parse(rawId);
        const task = await taskRepository.delete(id);
        if (!task) {
            throw new AppError(404, `Task with id ${id} not found`);
        }
        return task;
    },
};
