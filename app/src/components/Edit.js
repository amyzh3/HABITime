import React, { useState, useEffect } from "react";
import '../styles/signup.css';
import '../styles/selection.css'
import { useNavigate, useLocation } from "react-router-dom";
import Preferences from "./Preferences/Preferences";

export default function Edit() {
    const { state } = useLocation();
    const [selectedConcerns, setSelectedConcerns] = useState([]);
    const [selectedHabits, setSelectedHabits] = useState([]);

    const navigate = useNavigate();
    const nickname = "";
    const age = "";


    // TEST DATA
    const userConcerns = ["Depression", "Back Pain", "Anxiety",];

    const userHabits = ["Regular Exercise", "Healthy Eating", "Reading"];

    const fetchSelectionData = async () => {
      setSelectedConcerns(userConcerns);
      setSelectedHabits(userHabits);
    }
    useEffect(() => {
      (async () => {
        await fetchSelectionData();
      })();
    }, []);

    return (
        <div className="container">
            <div className="left">
                <h1 className="title">Edit your target concerns/habits:</h1>
                    <div className="form-group">
                        <Preferences
                            nickname={nickname}
                            age={age}
                            formDataProp={{ concerns: selectedConcerns, habits: selectedHabits }}
                            updateData={(updatedData) => {
                                setSelectedConcerns(updatedData.concerns);
                                setSelectedHabits(updatedData.habits);
                            }}
                            modification={true}
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

