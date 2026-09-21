import dotenv from "dotenv";
dotenv.config({ override: true });
import { z } from "zod";

const schema = z.object({
    PORT: z.coerce.number().default(3000),
    DATABASE_URL: z.string().url(),
    CLIENT_URL: z.string().default("http://localhost:5173"),
    STRIPE_SECRET_KEY: z.string(),
    STRIPE_WEBHOOK_SECRET: z.string(),
});

export const env = schema.parse(process.env);