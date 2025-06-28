import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function SurveyAnswersPage() {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    // Fetch survey and responses in parallel
    Promise.all([
      fetch(`http://localhost:23231/api/surveys/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => res.json()),
      fetch(`http://localhost:23231/api/responses/survey/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => res.json())
    ])
      .then(([surveyData, answersData]) => {
        setSurvey(surveyData);
        setAnswers(answersData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  // Helper to get question intitule by id
  const getQuestionIntitule = (questionId) => {
    if (!survey) return questionId;
    const q = survey.questions.find(q => q._id === questionId);
    return q ? q.intitule : questionId;
  };

  if (loading) return <div>Loading...</div>;
  if (!survey) return <div>Survey not found.</div>;

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto" }}>
      <h2>Survey Answers</h2>
      {answers.length === 0 ? (
        <div>No answers submitted yet.</div>
      ) : (
        answers.map((response, idx) => (
          <div key={response._id || idx} style={{ border: "1px solid #ccc", marginBottom: "1rem", padding: "1rem" }}>
            <strong>Response #{idx + 1}</strong>
            <ul>
              {response.reponses.map((ans, i) => (
                <li key={ans.question_id || i}>
                  <strong>Q:</strong> {getQuestionIntitule(ans.question_id)} <br />
                  <strong>A:</strong> {Array.isArray(ans.reponse) ? ans.reponse.join(", ") : ans.reponse}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
