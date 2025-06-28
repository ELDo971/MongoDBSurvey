// src/components/SurveyCard.jsx
import React from "react";

export default function SurveyCard({
  title,
  description,
  creator,
  onDelete,
  onEdit,
  onViewAnswers,
  showOwnerActions = false,
}) {
  return (
    <div style={{
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "1rem",
      marginBottom: "1rem",
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
    }}>
      <h3>{title}</h3>
      <p>{description}</p>
      {creator && (
  <p style={{ fontStyle: "italic", color: "#555", marginBottom: "1rem" }}>
    Created by: {creator}
  </p>
)}
      {showOwnerActions ? (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button onClick={onEdit}>Edit</button>
          <button onClick={onDelete} style={{ color: "red" }}>Delete</button>
          <button onClick={onViewAnswers}>View Answers</button>
        </div>
      ) : (
        <button onClick={onViewAnswers}>Answer</button>
      )}
    </div>
  );
}
