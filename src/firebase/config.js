import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDpdzzDBp-NdIEgs_3FtF8p3AdLxpabpm4",
  authDomain: "coffee-order-app-1c763.firebaseapp.com",
  projectId: "coffee-order-app-1c763",
  storageBucket: "coffee-order-app-1c763.firebasestorage.app",
  messagingSenderId: "770757748759",
  appId: "1:770757748759:web:e305a5dc3b9b194bd5d452"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);