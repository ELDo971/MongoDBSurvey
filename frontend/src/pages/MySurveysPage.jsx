import React, { useState, useEffect } from "react";
import SurveyCard from "../components/SurveyCard";
import { useNavigate } from "react-router-dom";


export default function MySurveysPage() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:23231/api/surveys/mine", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setSurveys(data);
        setLoading(false);
      })
      .catch(() => {
        setSurveys([]);
        setLoading(false);
      });
  }, [token]);

  // DELETE survey
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this survey?")) return;
    try {
      const res = await fetch(`http://localhost:23231/api/surveys/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setSurveys(surveys.filter(survey => survey._id !== id));
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete survey");
      }
    } catch (err) {
      alert("Network error while deleting survey");
    }
  };

  // UPDATE survey (navigate to edit page or open modal)
  const handleEdit = (id) => {
    navigate(`/edit-survey/${id}`);
  };

  // VIEW ANSWERS for a survey
  const handleViewAnswers = (id) => {
    navigate(`/survey/${id}/answers`);
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2>My Surveys</h2>
      <button style={{ marginBottom: "1rem" }} onClick={() => navigate("/create-survey")}>Create New Survey</button>
      <button style={{ marginBottom: "2rem" , marginLeft: "2rem"}} onClick={() => navigate("/")}>See all survey</button>
      {loading ? (
        <div>Loading...</div>
      ) : (
        surveys.map(survey => (
          <SurveyCard
            key={survey._id}
            title={survey.nom}
            description={survey.description}
            onEdit={() => handleEdit(survey._id)}
            onDelete={() => handleDelete(survey._id)}
            onViewAnswers={() => handleViewAnswers(survey._id)}
            showOwnerActions={true}
          />
          
        ))
      )}
    </div>
  );
}
