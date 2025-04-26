import React, { useState, useEffect } from "react";
import '../styles/signup.css';
import '../styles/selection.css'
import { useNavigate, useLocation } from "react-router-dom";
import Preferences from "./Preferences/Preferences";

export default function Selection() {
    const { state } = useLocation();
    const [selectedConcerns, setSelectedConcerns] = useState([]);
    const [selectedHabits, setSelectedHabits] = useState([]);

    const navigate = useNavigate();

    const { nickname, age } = state || {};

    useEffect(() => {
        if (!nickname || !age) {
            navigate("/signup"); // restart with signup if empty
        }
    }, [nickname, age, navigate]);

    return (
        <div className="container">
            <div className="left">
                <h1 className="title">You're almost there!</h1>
                    <div className="form-group">
                        <Preferences
                            nickname={nickname}
                            age={age}
                            formData={{ concerns: selectedConcerns, habits: selectedHabits }}
                            updateData={(updatedData) => {
                                setSelectedConcerns(updatedData.concerns);
                                setSelectedHabits(updatedData.habits);
                            }}
                        />
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
