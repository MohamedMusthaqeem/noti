// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBU85OSo7-Thnkv_8HZivRAurNWi9WiGI8",
  authDomain: "otpverify-6bc29.firebaseapp.com",
  projectId: "otpverify-6bc29",
  storageBucket: "otpverify-6bc29.appspot.com",
  messagingSenderId: "983337757214",
  appId: "1:983337757214:web:b476a7945ad70f59151c0f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
auth.settings.appVerificationDisabledForTesting = true;
