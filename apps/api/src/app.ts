import express from "express";
import cors from "cors";
import helmet from "helmet";
import { eventsRouter } from "./routes/events.js";

export const app = express();

app.use(helmet());

app.use(helmet());

app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:3000"
    ]
}));

app.use(express.json());

app.use( "/api/events", eventsRouter );

app.get("/health", (_req, res) => {
    res.json({
        status: "ok",
        service: "flashseat-api"
    });
 }
);