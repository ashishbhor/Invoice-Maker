// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbhAAgJBDTBsGM97j1ra0teu-XivAxAeQ",
  authDomain: "vbcloud-1396d.firebaseapp.com",
  projectId: "vbcloud-1396d",
  storageBucket: "vbcloud-1396d.firebasestorage.app",
  messagingSenderId: "401437737882",
  appId: "1:401437737882:web:e01b0abdfd4ea8ca087023"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Storage
export const db = getFirestore(app);