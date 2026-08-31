import pg from "pg";

import { env } from "./config.ts";

const { Pool } = pg;

export const pool = 
  new Pool({

    connectionString:
      env.DATABASE_URL,

    ssl:
      env.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : undefined,

    max: 10
  });