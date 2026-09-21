import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { tasks } from "../db/schema/index.js";
import type { Task } from "../db/schema/index.js";
import type { CreateTaskInput, UpdateTaskInput } from "../types/task.types.js";

export const taskRepository = {
    async findAll(): Promise<Task[]> {
        return db.select().from(tasks);
    },

    async findById(id: number): Promise<Task | undefined> {
        const rows = await db.select().from(tasks).where(eq(tasks.id, id));
        return rows[0];
    },

    async create(data: CreateTaskInput): Promise<Task> {
        const rows = await db.insert(tasks).values(data).returning();
        return rows[0]!;
    },

    async update(id: number, data: UpdateTaskInput): Promise<Task | undefined> {
        const rows = await db
            .update(tasks)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(tasks.id, id))
            .returning();
        return rows[0];
    },

    async delete(id: number): Promise<Task | undefined> {
        const rows = await db
            .delete(tasks)
            .where(eq(tasks.id, id))
            .returning();
        return rows[0];
    },
};
