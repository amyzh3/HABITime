import React, {useEffect, useState} from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import '../styles/login.css';

export default function Login() {
    const [user, setUser] = useState(null);
    const [authCode, setAuthCode] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
          const result = await signInWithPopup(auth, provider);
          setUser(result.user);
          console.log("Logged in:", result.user);
          localStorage.setItem("uid", result.user.uid);
          navigate("/cal");
        } catch (error) {
          console.error("Login failed:", error);
        }
    };

    const handleSignup = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            setUser(result.user);
            console.log("Signed up:", result.user);
            localStorage.setItem("uid", result.user.uid);

            const client = window.google.accounts.oauth2.initCodeClient({
                client_id: "337868506427-vd8hnb3qhpjbohmbcdn43fqsc41tut3i.apps.googleusercontent.com", // Google Cloud OAuth Client ID
                scope: 'https://www.googleapis.com/auth/calendar.readonly',
                access_type: 'offline',
                ux_mode: 'popup',
                callback: async (response) => {
                    console.log('Authorization code:', response.code);
                    localStorage.setItem('googleAuthCode', response.code);
                    setAuthCode(response.code);
                }
            });
            client.requestCode();

            navigate("/signup");
        } catch (error) {
            console.error("Signup failed:", error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-left">
                <h1 className="title">Live healthier,</h1>
                <p className="subtitle">one day at a time.</p>
                <p className="description">
                    Log in or sign up to Rootine<br />
                    with your Google account.
                </p>
            </div>
            <div className="login-right">
                <button onClick={handleLogin} className="login-button">Log in with Google</button>
                <button onClick={handleSignup} className="signup-button">Sign up with Google</button>
            </div>
        </div>
    );
}