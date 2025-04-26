import { useState } from "react";
import Choices from "./Choices";
import "./Preferences.css";

const concerns = [
    "Depression", "Anxiety", "Chronic-fatigue", "Bad-posture", "Back-pain", "Constipation",
    "Vitamin-D-deficiency"
];

const habits = [
    "Journaling", "Healthy-eating", "Regular-exercise", "Limited-screen-time", "Reading", "Sleep-eight-hours"
];

function Preferences(nickname, age) {
    const [formData, setFormData] = useState({ concerns: [], habits: [] });
    const user = parseInt(localStorage.getItem("uid"), 10);

    const handleSubmitPreferences = () => {
        console.log(formData);
        // console.log(localStorage.getItem("uid"));
        // console.log(user);
        // fetch("http://localhost:8080/project/api/preferences/update", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify({
        //         concerns: formData.concerns,
        //         habits: formData.habits,
        //         userId: user
        //     })
        // })
        //     .then(response => response.json())
        //     .then(data => {
        //         console.log("Preferences updated:", data);
        //         window.location.href = "/dashboard";
        //     })
        //     .catch(error => {
        //         console.error("Error updating preferences:", error);
        //     });
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
