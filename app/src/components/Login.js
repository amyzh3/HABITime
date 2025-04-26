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


          const client = window.google.accounts.oauth2.initCodeClient({
            client_id: 'Google client id', // Google Cloud OAuth Client ID
            scope: 'https://www.googleapis.com/auth/calendar.readonly',
            access_type: 'offline',
            ux_mode: 'popup',
            callback: async (response) => {
              console.log('Authorization code:', response.code);
              // TODO: send this response.code to your backend to exchange for access/refresh tokens
            }
          });
      
          client.requestCode();
        } catch (error) {
          console.error("Login failed:", error);
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
                <button onClick={handleLogin} className="signup-button">Sign up with Google</button>
            </div>
        </div>
    );
}