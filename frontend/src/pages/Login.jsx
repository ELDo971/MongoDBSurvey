import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState(""); // Use email if your backend expects it
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:23231/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/my-surveys");
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div style={{ maxWidth: 300, margin: "2rem auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "1rem" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "1rem" }}
        />
        <button type="submit" style={{ width: "100%" }}>Login</button>
        {error && <div style={{ color: "red", marginTop: "1rem" }}>{error}</div>}
      </form>
      <button
        style={{
          width: "100%",
          marginTop: "1rem",
          background: "#eee",
          color: "#333",
          border: "1px solid #ccc",
          borderRadius: "4px",
          padding: "0.5rem"
        }}
        onClick={() => navigate("/register")}
      >
        Create Account
      </button>
    </div>
  );
}
