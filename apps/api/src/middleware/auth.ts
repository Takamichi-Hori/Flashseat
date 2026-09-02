import type { NextFunction, Request, Response } from "express";
import { env } from "../config.js";
import { verifyIdToken } from "../firebase.js";

const adminEmails = new Set(
    env.ADMIN_EMAILS
        .split(",")
        .map(email => email.trim().toLowerCase())
        .filter(Boolean)
);

export async function requireAuth(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    
    try {
        const header = req.headers.authorization;

        if (!header?.startsWith("Bearer ")) {
            res.status(401).json({error: "missing_bearer_token"});
            return;
        }

        const token = header.slice(7);

        const decoded = await verifyIdToken(token);

        const email = decoded.email;

        if (!email) {
            res.status(401).json({error: "email_required"});
            return;
        }

        req.user = {
            uid: decoded.uid,
            email,
            ...(decoded.name ? {name: decoded.name} : {})
        };

        next();
    } catch {

        res.status(401).json({error: "invalid_token"});
    }
}

export function requireAdmin(
    req: Request,
    res: Response,
    next: NextFunction
): void {

    const email = req.user?.email?.toLowerCase();

    if (!email || !adminEmails.has(email)) {
        res.status(403).json({error: "admin_required"});
        return;
    }
    next();
}
