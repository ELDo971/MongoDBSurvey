import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function AnswerSurveyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:23231/api/surveys/${id}`)
      .then(res => res.json())
      .then(data => {
        setSurvey(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reponses = Object.entries(answers).map(([question_id, reponse]) => ({
      question_id,
      reponse,
    }));

    const response = await fetch("http://localhost:23231/api/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sondage_id: id,
        reponses,
      }),
    });

    if (response.ok) {
      alert("Thank you for your answers!");
      navigate("/");
    } else {
      alert("Failed to submit your answers.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!survey) return <div>Survey not found.</div>;

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2>{survey.nom}</h2>
      <p>{survey.description}</p>
      <form onSubmit={handleSubmit}>
        {survey.questions.map(q => (
          <div key={q._id} style={{ marginBottom: "1rem" }}>
            <label>
              <strong>{q.intitule}</strong>
            </label>
            {q.type === "ouverte" ? (
              <input
                type="text"
                value={answers[q._id] || ""}
                onChange={e => handleChange(q._id, e.target.value)}
                style={{ width: "100%" }}
                required
              />
            ) : (
              <div>
                {q.reponses.map((option, idx) => (
                  <label key={idx} style={{ display: "block" }}>
                    <input
                      type="checkbox"
                      checked={Array.isArray(answers[q._id]) && answers[q._id].includes(option)}
                      onChange={e => {
                        let arr = Array.isArray(answers[q._id]) ? answers[q._id] : [];
                        if (e.target.checked) {
                          arr = [...arr, option];
                        } else {
                          arr = arr.filter(o => o !== option);
                        }
                        handleChange(q._id, arr);
                      }}
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
        <button type="submit">Submit Answers</button>
      </form>
    </div>
  );
}
