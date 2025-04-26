import { useState } from "react";
import Choices from "./Choices";
import "./Preferences.css";
import {useNavigate} from "react-router-dom";

const concerns = [
    "Depression", "Anxiety", "Chronic-fatigue", "Bad-posture", "Back-pain", "Constipation",
    "Vitamin-D-deficiency"
];

const habits = [
    "Journaling", "Healthy-eating", "Regular-exercise", "Limited-screen-time", "Reading", "Sleep-eight-hours"
];

function Preferences({ nickname, age }) {
    const [formData, setFormData] = useState({ concerns: [], habits: [] });
    const user = localStorage.getItem("uid");

    const navigate = useNavigate();

    const handleSubmitPreferences = async (e) => {
        console.log(nickname)
        console.log(age)
        console.log(formData)
        const userData = {
            nickname,
            age,
            concerns,
            habits
        };
        try {
            const response = await fetch('/createuser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            const data = await response.json();
            console.log('User created successfully:', data);
            navigate("/cal");
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    const handleUpdateData = (updatedData) => {
        setFormData(updatedData);
    };

    return (
        <div className="center-block">
            <form className="choices-container">
                <label>Select up to 3 concerns you want to target</label>
                <div className="concerns-selection">
                    {concerns.map((category, ind) => (
                        <div className="preference-choices" key={ind}>
                            <Choices
                                filterName={category}
                                updateData={handleUpdateData}
                                formData={formData}
                                type="concerns"
                            />
                        </div>
                    ))}
                </div>
                <label>Select up to 3 habits you want to build</label>
                <div className="habits-selection">
                    {habits.map((category, ind) => (
                        <div className="preference-choices" key={ind}>
                            <Choices
                                filterName={category}
                                updateData={handleUpdateData}
                                formData={formData}
                                type="habits"
                            />
                        </div>
                    ))}
                </div>
            </form>
            <button id="submit-choices" onClick={handleSubmitPreferences}>Continue</button>
        </div>
    );
}

export default Preferences;
