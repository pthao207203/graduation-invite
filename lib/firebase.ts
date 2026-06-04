import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase, type Database } from "firebase/database";

// Realtime Database URL: use the explicit env var, otherwise derive the
// default RTDB URL from the project id so the app still works when only the
// core Firebase config is provided.
const databaseURL =
  process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
  (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    ? `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`
    : undefined);

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL,
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Lazily initialize the Realtime Database. It is only needed by the optional
// live-location feature, so we avoid initializing it at module load — that
// would throw and crash unrelated pages when no databaseURL is configured.
let rtdbInstance: Database | null = null;

export function getRtdb(): Database | null {
  if (!databaseURL) return null;
  if (!rtdbInstance) {
    rtdbInstance = getDatabase(app);
  }
  return rtdbInstance;
}
