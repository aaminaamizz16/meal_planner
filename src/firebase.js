import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "",
  authDomain: "meal buddy.firebaseapp.com",
  projectId: "meal-buddy-f683e",
  storageBucket: "meal buddy.appspot.com",
  messagingSenderId: "204810681749",
  appId: "meal-buddy-f683e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);