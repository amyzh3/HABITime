import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAjvVRxL-C1Gs5f-xrJx0a4Y-fsJ-ia9ls",
    authDomain: "lahacks-edca8.firebaseapp.com",
    projectId: "lahacks-edca8",
    storageBucket: "lahacks-edca8.firebasestorage.app",
    messagingSenderId: "1027943297750",
    appId: "1:1027943297750:web:8522ab0f4be4fd2f398f77",
    measurementId: "G-0CB61YTK25"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };