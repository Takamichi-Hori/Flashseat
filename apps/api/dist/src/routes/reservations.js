import { Router } from "express";
import { z } from "zod";
import { createReservation } from "../services/reservations.js";
export const reservationsRouter = Router();
reservationsRouter.post("/events/:eventId", async (req, res, next) => {
    try {
        const eventId = z.uuid().parse(req.params.eventId);
        const { quantity } = z.object({ quantity: z.number()
                .int()
                .min(1)
                .max(10)
        })
            .parse(req.body);
        const reservation = await createReservation(eventId, quantity, req.user);
        res.status(201)
            .json({
            reservation
        });
    }
    catch (error) {
        next(error);
    }
});
