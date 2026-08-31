/// <reference types="node" />

import "dotenv/config";
import { z } from "zod";

const schema = z.object({

    NODE_ENV:
      z.enum([
        "development",
        "test",
        "production"
      ])
      .default("development"),

    PORT:
      z.coerce
        .number()
        .int()
        .positive()
        .default(8080),

    DATABASE_URL:
      z.string().min(1),

    CORS_ORIGINS:
      z.string()
        .default("http//localhost:5173"),

    SKIP_AUTH:
      z.string()
        .default("false")
        .transform(v => v === "true"),

    ADMIN_EMAILS:
      z.string().default(""),

    FIREBASE_PROJECT_ID:
      z.string().optional(),

    FIREBASE_CLIENT_EMAIL:
      z.string().optional(),

    FIREBASE_PRIVATE_KEY:
      z.string().optional(),

    S3_ENABLED:
      z.string()
      .default("false")
      .transform(v => v === "true"),

    AWS_REGION:
      z.string()
        .default("ap-northeast-1"),

    AWS_S3_BUCKET:
      z.string().optional()
});

export const env =
  schema.parse(process.env);