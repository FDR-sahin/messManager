// =====================================================================
// FIREBASE CONFIG FILE
// =====================================================================
// Ei file e Firebase project er sathe connect kora hoy.
//
// KIBHABE APNAR FIREBASE CONFIG PABEN:
// 1. https://console.firebase.google.com -> apnar project open korun
// 2. Project Settings (gear icon) -> "Your apps" section
// 3. Web app (</>) icon click kore notun web app add korun (jodi na thake)
// 4. "firebaseConfig" object ta copy kore niche paste korun
//
// SHOTORKOTA: .env file e ei value gulo rakha hoyeche, GitHub e push
// korar age .gitignore e .env file ta add ache kina check korun.
// =====================================================================

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBEqJkVQtEy1c1b6P82lfAHcH_tRYV3MAc",
  authDomain: "mess-e6c34.firebaseapp.com",
  projectId: "mess-e6c34",
  storageBucket: "mess-e6c34.firebasestorage.app",
  messagingSenderId: "288654551375",
  appId: "1:288654551375:web:e03d4d70b9cde1ec547d3a"
};

// Firebase app initialize kora hocche
const app = initializeApp(firebaseConfig);

// auth = login/logout/signup er jonno
export const auth = getAuth(app);

// db = Firestore database, ekhane shob data (members, bazar, bills, notice) thakbe
export const db = getFirestore(app);

export default app;
