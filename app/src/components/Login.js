import React, {useEffect, useState} from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import '../styles/login.css';

export default function Login() {
    const [user, setUser] = useState(null);
    const [authCode, setAuthCode] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
          const result = await signInWithPopup(auth, provider);
          const uid = result.user.uid;

            const response = await axios.post('http://localhost:8080/login', { uid }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.exists) {
                console.log('User is already registered');
                setUser(result.user);
                localStorage.setItem("profile-imgURL", result.user.photoURL);
                localStorage.setItem("uid", uid);
                navigate('/dashboard');
            } else {
                console.log('New user. Redirecting to sign-up');
                alert("New user. Please sign up instead.");
                window.location.reload();
            }

        } catch (error) {
          console.error("Login failed:", error);
        }
    };

    const handleSignup = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            setUser(result.user);
            localStorage.setItem("profile-imgURL", result.user.photoURL);
            console.log("Signed up:", result.user);
            // localStorage.setItem("googleAuthCode", result)
            localStorage.setItem("uid", result.user.uid);
            try {    
                const newUserRes = await axios.get('http://localhost:8080/existing-user', {
                    params: { uid: result.user.uid },
                    headers: {
                    'Content-Type': 'application/json',
                    }
                });
                if(newUserRes.status === 200) {
                    console.log('user already exists, redirecting to /login');
                    // await axios.get('http://localhost:8080/login', { uid: result.user.uid }, {
                    //     headers: {
                    //         'Content-Type': 'application/json',
                    //     }
                    // });
                    const response = await axios.post('http://localhost:8080/login', { uid: result.user.uid }, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.data.exists) {
                        console.log('User is already registered');
                        setUser(result.user);
                        localStorage.setItem("uid", result.user.uid);
                        navigate('/dashboard');
                    }
                    return;
                }
            } catch(e) {
                if (e.response && e.response.status === 404) {
                    console.log('user doesnt exist continue signup');
                } else {
                    console.error('Error checking existing user:', e);
                    return; // stop if unexpected error
                }
            }

            const client = window.google.accounts.oauth2.initCodeClient({
                client_id: "337868506427-vd8hnb3qhpjbohmbcdn43fqsc41tut3i.apps.googleusercontent.com", // Google Cloud OAuth Client ID
                scope: 'https://www.googleapis.com/auth/calendar.readonly',
                access_type: 'offline',
                ux_mode: 'popup',
                callback: async (response) => {
                    console.log('response: ', response);
                    console.log('Authorization code:', response.code);
                    localStorage.setItem('googleAuthCode', response.code);
                    setAuthCode(response.code);
                },
                redirect_uri: "http://localhost:3000/signup"
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