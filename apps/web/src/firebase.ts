import { getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,

    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,

    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,

    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export function firebaseAuth() {

    const app = getApps()[0] ?? initializeApp(config);
    
    return getAuth(app);
}

export const googleProvider = new GoogleAuthProvider();

await signInWithPopup(
    firebaseAuth(),
    googleProvider
);

const token = await firebaseUser.getIdToken();