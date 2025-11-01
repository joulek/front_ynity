import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../pages/styles/MyExams.css";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

export default function MyExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleDeleteExam = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This exam will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/exam/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error();

      setExams((prev) => prev.filter((e) => e._id !== id));

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "The exam has been successfully deleted.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Delete error:", err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong while deleting the exam.",
      });
    }
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/exam/my`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setExams(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
          className="loading-circle"
        />
        <p className="loading-text">
          🧠 Our AI, powered by <span className="highlight-groq">Groq</span> and
          the <span className="highlight-llama">LLaMA&nbsp;3</span> model,
          <br /> is analyzing your revision data...
        </p>
      </div>
    );
  }
  return (
    <div className="my-exams-container">
      <Navbar />
      <div className="page-header-exam">
        <h1 className="page-title-exam">My Exams</h1>
      </div>
      <div className="exams-content">
        {exams.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <p className="empty-text">No exams found</p>
            <Link to="/generate" className="empty-cta">
              Create my first exam
            </Link>
          </div>
        ) : (
          <div className="exams-list">
            {exams.map((exam) => (
              <div key={exam._id} className="exam-item">
                <div className="exam-header">
                  <div className="exam-icons">
                    {exam.isCombined ? "🧩" : "📝"}
                  </div>
                  <div className="exam-info">
                    <h2 className="exam-name">
                      {exam.isCombined
                        ? `Combined Exam (${exam.type})`
                        : `${exam.courses[0]?.title || "Unknown course"}`}
                    </h2>
                    <div className="exam-meta">
                      <span className="exam-date">
                        {new Date(exam.createdAt).toLocaleString()}
                      </span>
                      <span className="exam-type">{exam.type}</span>
                      <span className="exam-count">
                        {exam.questionCount} questions
                      </span>
                    </div>
                  </div>
                </div>

                {exam.isCombined && (
                  <div className="exam-courses">
                    <span className="courses-label">
                      Included courses:{" "}
                      {exam.courses.map((c, i) => (
                        <span key={i} className="course-tag">
                          {c.title}
                        </span>
                      ))}
                    </span>
                  </div>
                )}

                <div className="exam-actions">
                  <Link
                    to={`/exam/${exam._id}`}
                    className="action-btn view-btn"
                  >
                    <span className="btn-icon">👁</span>
                    <span>View exam</span>
                  </Link>
                  <button
                    onClick={() => handleDeleteExam(exam._id)}
                    className="action-btn delete-btn"
                  >
                    <span className="btn-icon">🗑</span>
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
