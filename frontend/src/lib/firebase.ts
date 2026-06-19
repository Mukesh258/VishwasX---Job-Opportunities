import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let cachedAuth: ReturnType<typeof getAuth> | null = null;

const requiredFirebaseKeys: Array<keyof typeof firebaseConfig> = [
  "apiKey",
  "authDomain",
  "projectId",
  "appId",
];

const getMissingFirebaseKeys = (): string[] => {
  return requiredFirebaseKeys.filter((key) => !firebaseConfig[key]).map((key) => `VITE_FIREBASE_${key.replace(/[A-Z]/g, (match) => `_${match}`).toUpperCase()}`);
};

export const getFirebaseAuth = () => {
  if (cachedAuth) {
    return cachedAuth;
  }

  const missingKeys = getMissingFirebaseKeys();
  if (missingKeys.length > 0) {
    throw new Error(`Firebase config missing: ${missingKeys.join(", ")}. Add them in frontend/.env and restart Vite.`);
  }

  const app = initializeApp(firebaseConfig);
  cachedAuth = getAuth(app);
  return cachedAuth;
};
