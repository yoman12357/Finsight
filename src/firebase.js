import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAMGTuNyGEjoryDVwbRI2PrhN3bxRgh-TI",
    authDomain: "finsight-367cb.firebaseapp.com",
    projectId: "finsight-367cb",
    storageBucket: "finsight-367cb.firebasestorage.app",
    messagingSenderId: "585592388496",
    appId: "1:585592388496:web:facd984c3e5f1943741115"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };