import express from "express";
import cors from "cors";
import helmet from "helmet";
import { eventsRouter } from "./routes/events.js";
import { reservationsRouter } from "./routes/reservations.js";
import { requireAuth } from "./middleware/auth.js";
import { env } from "./config.js";
export const app = express();
app.use(helmet());
app.use(cors({
    origin: env.CORS_ORIGINS.split(",").map(origin => origin.trim())
}));
app.use(express.json());
app.use("/api/events", eventsRouter);
app.use("/api/reservations", requireAuth, reservationsRouter);
app.get("/health", (_req, res) => {
    res.json({
        status: "ok",
        service: "flashseat-api"
    });
});
