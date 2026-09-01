import { verifyIdToken } from "../firebase.js";

export async function requireAuth(req, res, next) {
    
    try {
        const header = req.headers.authorization;

        if (!header ?.startsWith("Bearer ")) {

            return res.status(401).json({error: "missing_bearer_token"});
        }

        const token = header.slice(7);

        const decoded = await verifyIdToken(token);

        req.user = {

            uid: decoded.uid,

            email: decoded.email,

            name: decoded.name
        };

        next();
    } catch {

        res.status(401).json({error: "invalid_token"});
    }
}

export function requireAdmin(req, res, next) {

    const email = req.user?.email?.toLowerCase();

    if (!email || !adminEmails.has(email)) {
        return res.status(403).json({error: "admin_required"});
    }
    next();
}

eventsRouter.post("/", requireAuth, requireAdmin, createEventHandler);