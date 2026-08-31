import { Router } from "express";
import { listEvents } from "../services/events.js";
import { z } from "zod";
import { getEvent } from "../services/events.js";

export const eventsRouter = Router();

eventsRouter.get("/", async (_req, res, next) => {
    try {
        const events = await listEvents();

        res.json({ events });
    } catch (error) {
        
        next(error);
    }
});

eventsRouter.get("/:id", async (req, res, next) => {

    try {
        const eventId = 
          z.string()
            .uuid()
            .parse(
                req.params.id
            );
        const event = await getEvent(eventId);

        res.json({ event });
    } catch (error) {
        
        next(error);
    }
});