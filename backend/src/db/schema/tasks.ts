import { pgTable, pgEnum, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const priorityEnum = pgEnum("task_priority", ["low", "medium", "high"]);
export const statusEnum = pgEnum("task_status", ["pending", "in_progress", "completed"]);

export const tasks = pgTable("tasks", {
    id: serial("id").primaryKey(),
    title: varchar("title", {
        length: 255
    }).notNull(),
    description: text("description").notNull().default(""),
    priority: priorityEnum("priority").notNull().default("medium"),
    status: statusEnum("status").notNull().default("pending"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;