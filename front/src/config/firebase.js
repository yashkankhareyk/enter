// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCYFCVsDBINzkb4haLvoP7D5VOBEhF6xtg",
  authDomain: "campuscompass-5a417.firebaseapp.com",
  projectId: "campuscompass-5a417",
  storageBucket: "campuscompass-5a417.firebasestorage.app",
  messagingSenderId: "709588937810",
  appId: "1:709588937810:web:b30fcc2e8762fe6e46c38b",
  measurementId: "G-5MJM4J25YF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app); 