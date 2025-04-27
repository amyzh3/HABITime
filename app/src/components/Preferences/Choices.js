import { useState } from "react";
import "./Choices.css";

function Choices({ filterName, updateData, formData, type }) {
    const isSelected = formData && formData[type] && formData[type].includes(filterName);
    const [isClicked, setIsClicked] = useState(isSelected);
    const isDisabled = formData[type]?.length >= 3 && !isSelected;

    const handleClick = () => {
        if (isDisabled) return;
        const updatedData = {
            ...formData,
            [type]: isSelected
                ? formData[type].filter((d) => d !== filterName)
                : [...formData[type], filterName],
        };
        updateData(updatedData);
        setIsClicked(!isClicked);
    };

    return (
        <div
            onClick={handleClick}
            // className={`filter-choice ${isClicked ? "when-clicked" : "when-not-clicked"}`}
            className={`filter-choice ${isClicked ? "when-clicked" : "when-not-clicked"} ${isDisabled ? "disabled" : ""}`}
            style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
        >
            <h1 className="filter-text">{filterName}</h1>
        </div>
    );
}

export default Choices;
