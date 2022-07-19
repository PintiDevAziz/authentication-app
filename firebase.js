import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyD7fSgxwMB_IavyycJI77c9I8Yp2I0vuHg",
  authDomain: "authentication-app-8e407.firebaseapp.com",
  projectId: "authentication-app-8e407",
  storageBucket: "authentication-app-8e407.appspot.com",
  messagingSenderId: "151675938768",
  appId: "1:151675938768:web:7494fabf0f3fa4f5cd3bd5",
  measurementId: "G-ZP4LZGQWCJ",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
export { auth, db, storage };
