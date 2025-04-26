import React, { useState } from "react";
import '../styles/signup.css';
import '../styles/selection.css'
import { useNavigate } from "react-router-dom";
import Preferences from "./Preferences/Preferences";

export default function Signup() {
    const [selectedConcerns, setSelectedConcerns] = useState([]);
    const [selectedHabits, setSelectedHabits] = useState([]);

    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        // Process form data here
        console.log({
            selectedConcerns,
            selectedHabits
        });
        navigate("/selection");
    };

    return (
        <div className="container">
            <div className="left">
                <h1 className="title">You're almost there!</h1>
                    <div className="form-group">
                        <Preferences></Preferences>
                    </div>
            </div>

            <div className="right">
                <div className="img-wrapper">
                    <img src="/assets/plant_sticker.PNG" alt="watering plant" className="icon"/>
                </div>
            </div>
        </div>
    );
}
