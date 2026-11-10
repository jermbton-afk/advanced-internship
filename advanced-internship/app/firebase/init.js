// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDDxaBNczdL-UKztveTK2OFixe8qTMob0Y",
  authDomain: "advanced-internship-76e7f.firebaseapp.com",
  projectId: "advanced-internship-76e7f",
  storageBucket: "advanced-internship-76e7f.firebasestorage.app",
  messagingSenderId: "531293504278",
  appId: "1:531293504278:web:b4d9ba8834dcff81b18637",
  measurementId: "G-TD1Y63XH52"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth()