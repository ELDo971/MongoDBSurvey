import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditSurveyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:23231/api/surveys/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setSurvey(data);
        setNom(data.nom);
        setDescription(data.description || "");
        setQuestions(
          data.questions.map(q =>
            q.type === "qcm"
              ? { ...q, reponses: q.reponses && q.reponses.length ? q.reponses : [""] }
              : { ...q, reponses: [] }
          )
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  // Handle question changes
  const handleQuestionChange = (idx, field, value) => {
    setQuestions(questions =>
      questions.map((q, i) =>
        i === idx ? { ...q, [field]: value } : q
      )
    );
  };

  // Handle QCM options change
  const handleQcmOptionChange = (qIdx, optIdx, value) => {
    setQuestions(questions =>
      questions.map((q, i) =>
        i === qIdx
          ? {
              ...q,
              reponses: q.reponses.map((opt, oi) =>
                oi === optIdx ? value : opt
              )
            }
          : q
      )
    );
  };

  // Add or remove questions/options
  const addQuestion = () =>
    setQuestions([
      ...questions,
      { intitule: "", type: "ouverte", reponses: [""] }
    ]);
  const removeQuestion = idx =>
    setQuestions(questions.filter((_, i) => i !== idx));
  const addQcmOption = qIdx =>
    setQuestions(questions =>
      questions.map((q, i) =>
        i === qIdx ? { ...q, reponses: [...q.reponses, ""] } : q
      )
    );
  const removeQcmOption = (qIdx, optIdx) =>
    setQuestions(questions =>
      questions.map((q, i) =>
        i === qIdx
          ? { ...q, reponses: q.reponses.filter((_, oi) => oi !== optIdx) }
          : q
      )
    );

  // Submit survey update
  const handleUpdate = async e => {
    e.preventDefault();
    setError("");
    const token = localStorage.getItem("token");

    // Prepare the questions for backend: remove empty QCM options, etc.
    const cleanedQuestions = questions.map(q => ({
      intitule: q.intitule,
      type: q.type,
      reponses: q.type === "qcm" ? q.reponses.filter(opt => opt.trim() !== "") : []
    }));

    try {
      const res = await fetch(`http://localhost:23231/api/surveys/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nom,
          description,
          questions: cleanedQuestions
        })
      });
      if (res.ok) {
        alert("Survey updated!");
        navigate("/my-surveys");
      } else {
        const data = await res.json();
        setError(data.message || "Update failed");
      }
    } catch {
      setError("Network error");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!survey) return <div>Survey not found.</div>;

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto" }}>
      <h2>Edit Survey</h2>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          value={nom}
          onChange={e => setNom(e.target.value)}
          required
          placeholder="Survey Name"
          style={{ width: "100%", marginBottom: "1rem" }}
        />
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description"
          style={{ width: "100%", marginBottom: "1rem" }}
        />
        <h3>Questions</h3>
        {questions.map((q, idx) => (
          <div key={idx} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
            <input
              type="text"
              placeholder={`Question ${idx + 1}`}
              value={q.intitule}
              onChange={e => handleQuestionChange(idx, "intitule", e.target.value)}
              required
              style={{ width: "100%", marginBottom: "0.5rem" }}
            />
            <select
              value={q.type}
              onChange={e => handleQuestionChange(idx, "type", e.target.value)}
              style={{ marginBottom: "0.5rem" }}
            >
              <option value="ouverte">Open (text)</option>
              <option value="qcm">QCM (multiple choice)</option>
            </select>
            {q.type === "qcm" && (
              <div>
                <strong>QCM Options:</strong>
                {q.reponses.map((opt, optIdx) => (
                  <div key={optIdx} style={{ display: "flex", alignItems: "center", marginBottom: "0.25rem" }}>
                    <input
                      type="text"
                      value={opt}
                      onChange={e => handleQcmOptionChange(idx, optIdx, e.target.value)}
                      required
                      style={{ flex: 1 }}
                    />
                    {q.reponses.length > 1 && (
                      <button type="button" onClick={() => removeQcmOption(idx, optIdx)} style={{ marginLeft: 8 }}>
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => addQcmOption(idx)} style={{ marginTop: 4 }}>
                  Add Option
                </button>
              </div>
            )}
            <button type="button" onClick={() => removeQuestion(idx)} style={{ marginTop: 8, color: "red" }}>
              Remove Question
            </button>
          </div>
        ))}
        <button type="button" onClick={addQuestion} style={{ marginBottom: "1rem" }}>
          Add Question
        </button>
        <br />
        <button type="submit">Save Changes</button>
        {error && <div style={{ color: "red", marginTop: "1rem" }}>{error}</div>}
      </form>
    </div>
  );
}
