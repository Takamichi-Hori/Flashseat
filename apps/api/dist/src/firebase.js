import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { env } from "./config.js";
function firebaseApp() {
    if (getApps().length) {
        return getApps()[0];
    }
    if (!env.FIREBASE_PROJECT_ID || !env.FIREBASE_CLIENT_EMAIL || !env.FIREBASE_PRIVATE_KEY) {
        throw new Error("Firebase Admin credentials are not configured");
    }
    return initializeApp({
        credential: cert({
            projectId: env.FIREBASE_PROJECT_ID,
            clientEmail: env.FIREBASE_CLIENT_EMAIL,
            privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
        })
    });
}
export async function verifyIdToken(token) {
    firebaseApp();
    return getAuth()
        .verifyIdToken(token);
}
