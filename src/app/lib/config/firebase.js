// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey:  process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "mern-blog-b0c64.firebaseapp.com",
  projectId: "mern-blog-b0c64",
  storageBucket: "mern-blog-b0c64.appspot.com",
  messagingSenderId: "1971146237",
  appId: "1:1971146237:web:68a3ec190b9e8ec5a69d94",
  measurementId: "G-G6ET4NNLVH"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);