import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SurveyCard from "../components/SurveyCard";

export default function AllSurveys() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = localStorage.getItem("user");

  useEffect(() => {
    // Fetch surveys from backend
    fetch("http://localhost:23231/api/surveys")
      .then(res => res.json())
      .then(data => {
        setSurveys(data);
        setLoading(false);
      })
      .catch(() => {
        setSurveys([]);
        setLoading(false);
      });
  }, []);

  const handleCreateSurvey = () => {
    if (user) {
      navigate("/my-surveys");
    } else {
      navigate("/login");
    }
  };

  const handleAnswer = (surveyId) => {
    navigate(`/survey/${surveyId}/answer`);
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2>All Surveys</h2>
      <button onClick={handleCreateSurvey} style={{ marginBottom: "2rem" }}>
        Create Your Own Survey
      </button>
      {loading ? (
        <div>Loading...</div>
      ) : (
        surveys.map(survey => (
          <SurveyCard
            key={survey._id}
            title={survey.nom}
            creator={survey.createur?.username}
            description={survey.description}
            onViewAnswers={() => handleAnswer(survey._id)}
          />
        ))
      )}
    </div>
  );
}
