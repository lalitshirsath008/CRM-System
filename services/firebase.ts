
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCQsGJv7TbyaYNMAyYrm0fJYAGhvkoPLQk",
  authDomain: "nexusoffice-815cc.firebaseapp.com",
  projectId: "nexusoffice-815cc",
  databaseURL: "https://nexusoffice-815cc-default-rtdb.firebaseio.com", // CRITICAL FIX: Added RTDB URL
  storageBucket: "nexusoffice-815cc.firebasestorage.app",
  messagingSenderId: "887825654373",
  appId: "1:887825654373:web:c5d43afdb641d0ba019c8c",
  measurementId: "G-KL67P941HV"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const auth = getAuth(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
