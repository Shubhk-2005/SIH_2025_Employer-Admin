// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Add this import

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDH7SyrRAuNv1ENP-bJHfQiB3m8L_d8i7c",
  authDomain: "yuvasetu-admin.firebaseapp.com",
  projectId: "yuvasetu-admin",
  storageBucket: "yuvasetu-admin.firebasestorage.app",
  messagingSenderId: "517673273626",
  appId: "1:517673273626:web:576f14ba09d79bb5ec04a3",
  measurementId: "G-TMWC00MQ8F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize and export Firebase Authentication
export const auth = getAuth(app);

// Initialize and export Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Optional: Configure Google Provider
googleProvider.setCustomParameters({
  prompt: 'select_account' // Forces account selection
});

// Initialize and export Firestore
export const db = getFirestore(app); // Add this line
