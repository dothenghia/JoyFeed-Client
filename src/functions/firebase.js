
// ======= Import the functions
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // Realtime Database
import { getAuth } from "firebase/auth"; // Authentication

// ======= Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD7Hl6psEa09ktEpUcpAULhChv4pD8M6IU",
    authDomain: "joyfeed-6f7a8.firebaseapp.com",
    projectId: "joyfeed-6f7a8",
    storageBucket: "joyfeed-6f7a8.appspot.com",
    messagingSenderId: "79904275884",
    appId: "1:79904275884:web:71591f6e81392cc4e9ce09",
    measurementId: "G-J1KKL13YBP",
    databaseURL: "https://joyfeed-6f7a8-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// ======= Initialize Firebase
const app = initializeApp(firebaseConfig);

// ======= Initialize Realtime Database
const db = getDatabase(app);
const auth = getAuth(app);

export { db, auth };
