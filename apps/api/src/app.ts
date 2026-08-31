import express from "express";
import cors from "cors";
import helmet from "helmet";

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

app.get("/health", (_req, res) => {
    res.json({
        status: "ok",
        service: "flashseat-api"
    });
 }
);