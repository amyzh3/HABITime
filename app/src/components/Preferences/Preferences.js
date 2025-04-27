import { useState, useEffect } from "react";
import Choices from "./Choices";
import "./Preferences.css";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const fullconcerns = [
    "Depression", "Anxiety", "Chronic Fatigue", "Bad Posture", "Back Pain", "Constipation",
    "Vitamin D Deficiency"
];

const fullhabits = [
    "Journaling", "Healthy Eating", "Regular Exercise", "Limited Screen Time", "Reading", "Sleep Eight Hours"
];

function Preferences({ nickname, age, formDataProp, updateData, modification }) {
    const [formData, setFormData] = useState(formDataProp || { concerns: [], habits: [] });
    const user = localStorage.getItem("uid");

    const navigate = useNavigate();

    useEffect(() => {
        if (formDataProp) {
            setFormData(formDataProp);
        }
    }, [formDataProp]);

    const handleSubmitPreferences = async (e) => {
        console.log(nickname)
        console.log(age)
        console.log(formData)
        const userData = {
            code: localStorage.getItem("googleAuthCode"),
            uid: localStorage.getItem("uid"),
            nickname,
            age,
            concerns: formData.concerns,
            habits: formData.habits
        };
        try {
            console.log("POSTING TO http://localhost:8080/createuser")
            const response = await axios.post('http://localhost:8080/createuser', userData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.status === 302) {
                window.location.href = response.data.redirectUrl;
                console.log('user already exists. redirected to /login');
              }
            console.log('User created successfully:', response.data);
            navigate("/dashboard");
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    const handleModifyConcerns = async (e) => {
        console.log(nickname);
        console.log(age);
        console.log(formData);
        const updatedData = {
            uid: localStorage.getItem("uid"),
            newConcerns: formData.concerns,
            newHabits: formData.habits
        };
        console.log('updatedData: ', updatedData);
        try {
            const response = await axios.post('http://localhost:8080/modify-concerns', updatedData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.status === 200) {
                console.log('Concerns updated successfully:', response.data);
                navigate("/dashboard");
                // need to also store 
            }
        } catch (error) {
            console.error("Error modifying concerns:", error);
        }
    };

    const handleUpdateData = (updatedData) => {
        setFormData(updatedData);
    };

    const handleSubmit = modification ? handleModifyConcerns : handleSubmitPreferences;

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
            <button id="submit-choices" onClick={handleSubmit}>Continue</button>
        </div>
    );
}

export default Preferences;
