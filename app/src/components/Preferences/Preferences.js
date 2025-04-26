import { useState } from "react";
import Choices from "./Choices";
import "./Preferences.css";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const fullconcerns = [
    "Depression", "Anxiety", "Chronic-fatigue", "Bad-posture", "Back-pain", "Constipation",
    "Vitamin-D-deficiency"
];

const fullhabits = [
    "Journaling", "Healthy-eating", "Regular-exercise", "Limited-screen-time", "Reading", "Sleep-eight-hours"
];

function Preferences({ nickname, age}) {
    const [formData, setFormData] = useState({ concerns: [], habits: [] });
    const user = localStorage.getItem("uid");

    const navigate = useNavigate();

    const handleSubmitPreferences = async (e) => {
        console.log(nickname)
        console.log(age)
        console.log(formData)
        const userData = {
            code: localStorage.getItem("googleAuthCode"),
            nickname,
            age,
            concerns: formData.concerns,
            habits: formData.habits
        };
        try {
            const response = await axios.post('http://localhost:8080/createuser', userData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
    
            console.log('User created successfully:', response.data);
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
                    {fullconcerns.map((category, ind) => (
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
                    {fullhabits.map((category, ind) => (
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
