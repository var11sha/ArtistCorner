// src/components/MoodFilter.jsx
import React from "react";

const moods = ["morning", "study", "workout", "relax", "night"];

const MoodFilter = ({ selectedMood, onMoodChange }) => {
  return (
    <div className="mood-filter">
      {moods.map((mood) => (
        <button
          key={mood}
          className={selectedMood === mood ? "active" : ""}
          onClick={() => onMoodChange(mood)}
        >
          {mood.charAt(0).toUpperCase() + mood.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default MoodFilter;
