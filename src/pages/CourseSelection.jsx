import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import Navbar from "../components/Navbar.jsx";
import "../pages/styles/CourseSelection.css";
import learningGame from "../assets/select-course.png";

export default function CourseSelection() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/course/with-flashcards`, {
        withCredentials: true,
      })
      .then((res) => {
        setCourses(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="game-selection-container">
      <Navbar />
      <div className="decoration-element decor-1"></div>
      <div className="decoration-element decor-2"></div>
      <div className="decoration-element decor-3"></div>

      <div className="game-selection-split-layout">
        {/* Left Section - Form */}
        <div className="form-section">
          <div className="form-container">
            <h1 className="page-title">Learn smarter. Play harder!</h1>
            <p className="page-subtitle">Boost your knowledge with interactive challenges</p>
            
            <div className="game-form-card">
              <div className="form-header">
                <span className="form-icon">🎯</span>
                <h2>Start Your Challenge</h2>
              </div>

              {isLoading ? (
                <div className="loading-animation">
                  <div className="spinner"></div>
                  <p>Loading courses...</p>
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <p className="form-description">Choose a topic and challenge your brain through fun quizzes!</p>
                    <label htmlFor="courseSelect">Select a course</label>
                    <div className="select-wrapper">
                      <select
                        id="courseSelect"
                        value={selectedCourseId}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                      >
                        <option value="">-- Select --</option>
                        {courses.map((c) => (
                          <option key={c._id} value={c._id}>{c.title}</option>
                        ))}
                      </select>
                      <div className="select-arrow"></div>
                    </div>
                  </div>
                  <button 
                    className="primary-button" 
                    onClick={() => navigate("/create-room", { state: { selectedCourseId } })}
                    disabled={!selectedCourseId}
                  >
                    <span>Launch Game</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - Illustration */}
        <div className="illustration-section">
          <div className="illustration-content">
            <img 
              src={learningGame} 
              alt="Learning Game" 
              className="main-illustration"
            />
            <div className="illustration-overlay">
              <h2>Challenge Yourself!</h2>
              <p>Test your knowledge and have fun while learning</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}