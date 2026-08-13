import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Primary Firebase App
export const clientApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const clientAuth = getAuth(clientApp);
export const clientDb = getFirestore(clientApp);

// Initialize Secondary App for creating staff accounts without disrupting current Admin Auth session
export const getSecondaryAuth = () => {
  const secondaryAppName = "SecondaryStaffApp";
  const existingSecondary = getApps().find(app => app.name === secondaryAppName);
  const secondaryApp = existingSecondary || initializeApp(firebaseConfig, secondaryAppName);
  return getAuth(secondaryApp);
};
