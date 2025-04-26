import React, {useEffect, useState} from "react";
import '../styles/login.css';

export default function Login() {
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
                <button className="login-button">Log in with Google</button>
                <button className="signup-button">Sign up with Google</button>
            </div>
        </div>
    );
}