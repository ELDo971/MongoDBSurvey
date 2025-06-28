import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import MySurveysPage from "./pages/MySurveysPage";
import AllSurveys from "./pages/AllSurveys";
import SurveyAnswersPage from "./pages/SurveyAnswersPage";
import EditSurveyPage from "./pages/EditSurveyPage";
import AnswerSurveyPage from "./pages/AnswerSurveyPage";
import RegisterPage from "./pages/Register";
import CreateSurveyPage from "./pages/CreateSurveyPage";

const isAuthenticated = () => !!localStorage.getItem("user");

function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AllSurveys />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/my-surveys"
          element={
            <PrivateRoute>
              <MySurveysPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/survey/:id/answers" element={<SurveyAnswersPage />} />;
        <Route path="/edit-survey/:id" element={<EditSurveyPage />} />;
        <Route path="/survey/:id/answer" element={<AnswerSurveyPage />} />;
        <Route path="/create-survey" element={<CreateSurveyPage />} />
      </Routes>
    </Router>
  );
}

export default App;
