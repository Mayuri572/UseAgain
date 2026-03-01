/**
 * Firebase configuration for UseAgain
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://console.firebase.google.com
 * 2. Create a new project named "useagain"
 * 3. Enable Authentication (Google + Email/Password)
 * 4. Enable Firestore Database (start in test mode)
 * 5. Register a web app and copy your firebaseConfig
 * 6. Replace the config below with your actual config
 * 7. Copy .env.example to .env and add your keys
 * 
 * DEMO MODE: When VITE_USE_MOCK=true (default), the app uses
 * mock data and simulated auth — no Firebase needed.
 */

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Replace with your Firebase project config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "DEMO_MODE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "useagain-demo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "useagain-demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:000000000000:web:demo",
};

let app, auth, db, storage, googleProvider;

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

if (!USE_MOCK) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  googleProvider = new GoogleAuthProvider();
}

export { auth, db, storage, googleProvider, USE_MOCK };
export default app;
