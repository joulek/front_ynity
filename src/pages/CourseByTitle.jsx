import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../pages/styles/CourseByTitle.css";

export default function CourseByTitle() {
  const { title } = useParams();
  const [course, setCourse] = useState(null);
  const [exam, setExam] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(
        `${import.meta.env.VITE_BACKEND_URL}/api/course/by-title/${encodeURIComponent(title)}`,
        { withCredentials: true }
      )
      .then((res) => {
        setCourse(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Course not found.");
        setIsLoading(false);
      });
  }, [title]);

  useEffect(() => {
    if (course?._id) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/exam/by-course/${course._id}`, {
        credentials: "include",
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) setExam(data);
        })
        .catch((err) => console.warn("No exam found:", err));
    }
  }, [course]);

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!course) return <div>No course found</div>;

  return (
    <div className="course-page">
      <Navbar />
      <div className="course-detail-container">

        {/* HEADER */}
        <div className="course-header">
          <div className="aurora-container">
            <h1 className="course-title-bytitle">{course.title}</h1>
            <div className="aurora-item"></div>
            <div className="aurora-item"></div>
            <div className="aurora-item"></div>
          </div>
          <span className="course-subject">Subject: {course.subject}</span>
        </div>

        {/* COURSE DOCUMENT */}
        <div className="file-card">
          <div className="file-left">
            <div className="file-icon">📄</div>
            <div className="file-info">
              <h4>Course Document</h4>
              <p>Download the course material</p>
            </div>
          </div>

          <a
            href={`${import.meta.env.VITE_BACKEND_URL}/${course.file}`}
            target="_blank"
            rel="noreferrer"
            className="action-btn btn-primary"
          >
            ⬇️ Download
          </a>
        </div>

        {/* SUMMARY IF EXISTS */}
        {course.summaryExists && (
          <div className="summary-card">
            <div className="summary-left">
              <div className="summary-icon">📘</div>
              <div className="summary-text">
                <h4>Summary available</h4>
                <p>Condensed version of this course</p>
              </div>
            </div>

            <a
              href={`/courses/${course._id}/full-summary`}
              className="action-btn btn-outline"
            >
              View Summary
            </a>
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="action-buttons">
          <button
            className="action-btn btn-primary"
            onClick={() => navigate(`/flashcards/${course._id}`)}
          >
            🧠 Flashcards
          </button>

          {exam && (
            <button
              className="action-btn btn-primary"
              onClick={() => navigate(`/exam/${exam._id}`)}
            >
              📝 Take Exam
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
