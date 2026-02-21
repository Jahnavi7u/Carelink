import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBH0k26-_SjnwGtnECbsRIOKB7-Baqj5a0",
  authDomain: "smvit2025-4325a.firebaseapp.com",
  projectId: "smvit2025-4325a",
  storageBucket: "smvit2025-4325a.firebasestorage.app",
  messagingSenderId: "754716365912",
  appId: "1:754716365912:web:6b020fc71aa3e46982262d",
  measurementId: "G-W8TWZE3DGC",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
