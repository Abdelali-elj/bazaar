import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBNH1Zx6tmDjSOxaQewC2pvNoodqWzTjX8",
  authDomain: "bazaar-style.firebaseapp.com",
  projectId: "bazaar-style",
  storageBucket: "bazaar-style.firebasestorage.app",
  messagingSenderId: "1026598125683",
  appId: "1:1026598125683:web:1f35b0cb9afd6f3e752a06",
  measurementId: "G-0FRD414TFB"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
