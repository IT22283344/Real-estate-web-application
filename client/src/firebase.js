// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-655d5.firebaseapp.com",
  projectId: "real-estate-655d5",
  storageBucket: "real-estate-655d5.appspot.com",
  messagingSenderId: "570701664620",
  appId: "1:570701664620:web:1321018a2c4485f2416349"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);