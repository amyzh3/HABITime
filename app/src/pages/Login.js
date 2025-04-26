import React, {useEffect, useState} from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import '../styles/login.css';

export default function Login() {

    const [user, setUser] = useState(null);

    const handleLogin = async () => {
        try {
          const result = await signInWithPopup(auth, provider);
          setUser(result.user);
          console.log("Logged in:", result.user);
        } catch (error) {
          console.error("Login failed:", error);
        }
    };

    return (
        <div className="container">
            <div className="left">
                <h1 className="title">Live healthier,</h1>
                <p className="subtitle">one day at a time.</p>
                <p className="description">
                    Log in or sign up to Rootine<br />
                    with your Google account.
                </p>
            </div>

            <div className="right">
                <button onClick={handleLogin} className="login-button">Log in with Google</button>
                <button className="signup-button">Sign up with Google</button>
            </div>
        </div>
    );
}