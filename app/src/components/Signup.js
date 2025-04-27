import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/signup.css';

export default function Signup() {
    const [nickname, setNickname] = useState('');
    const [age, setAge] = useState('');

    const navigate = useNavigate();

    const ageOptions = [
        { value: '', label: 'Select your age' },
        { value: '18-24', label: '18-24' },
        { value: '25-34', label: '25-34' },
        { value: '35-44', label: '35-44' },
        { value: '45-54', label: '45-54' },
        { value: '55+', label: '55+' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        // Process form data here
        console.log({
            nickname,
            age
        });
        navigate("/selection", {
            state: { nickname, age },
        });
    };

    return (
        <div className="container">
            <div className="left">
                <h1 className="title">Take your first step towards a healthier lifestyle.</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="nickname">Nickname</label>
                        <input
                            type="text"
                            id="nickname"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            required
                            placeholder="Enter your nickname"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="age">Age</label>
                        <select
                            id="age"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            required
                        >
                            {ageOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button id="submit-choices" onClick={handleSubmit}>Continue</button>
                </form>
            </div>

            <div className="right">
                <div className="img-wrapper">
                    <img src="/assets/plant_sticker.PNG" alt="watering plant" className="icon"/>
                </div>
            </div>
        </div>
    );
}
