// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider,createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'; 




// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:"AIzaSyD6LYkjJDJ1PYdAPcfMRkPTlam3Qrxrgns" ,
  authDomain: "ai-exam-correction.firebaseapp.com",
  projectId: "ai-exam-correction",
  storageBucket: "ai-exam-correction.firebasestorage.app",
  messagingSenderId: "656220173176",
  appId: "1:656220173176:web:38bd7a73664a3affa30e8d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

// Google Sign-In provider
const provider = new GoogleAuthProvider();

// Export for use in your app
export { auth, provider };