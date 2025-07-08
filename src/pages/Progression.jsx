import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../pages/styles/progression.css";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiBookOpen } from "react-icons/fi";

function Progression() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/attempts/my`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        const valid = data.filter(
          (a) =>
            a &&
            typeof a.correct === "number" &&
            typeof a.total === "number" &&
            a.total > 0 &&
            a.subject?.label
        );
        setAttempts(valid);
      })
      .finally(() => setLoading(false));
  }, []);

  const groupedBySubject = attempts.reduce((acc, attempt) => {
    const subjectId = attempt.subject._id;
    if (!acc[subjectId]) {
      acc[subjectId] = {
        label: attempt.subject.label,
        subjectId,
        total: 0,
        correct: 0,
        count: 0,
      };
    }
    acc[subjectId].total += attempt.total;
    acc[subjectId].correct += attempt.correct;
    acc[subjectId].count += 1;
    return acc;
  }, {});

  const totalSubjects = Object.keys(groupedBySubject).length;
  const masteredSubjects = Object.values(groupedBySubject).filter(
    (s) => s.correct / s.total >= 0.8
  ).length;
  const overallProgressPercent = Math.round(
    (masteredSubjects / totalSubjects) * 100
  );
  if (loading) {
    return (
      <div className="loading-screen">
        <motion.div
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
          className="loading-circle"
        />
        <p className="loading-text">
          🧠 Our AI, powered by <span className="highlight-groq">Groq</span> and the <span className="highlight-llama">LLaMA&nbsp;3</span> model,<br/> is analyzing your revision data...
        </p>
      </div>
    );
  }

  if (totalSubjects === 0) {
    return (
      <div className="progression-container">
        <Navbar />
        <div className="empty-state">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="empty-illustration"
          >
            <FiBookOpen size={60} />
          </motion.div>
 <h2>No attempts recorded</h2>
          <p>Start a quiz to see your progress here.</p>
          <Link to="/subjects" className="back-link">
            Explore Subjects
          </Link>
        </div>
      </div>
    );
  }

  const mastered = [];
  const notMastered = [];
  Object.values(groupedBySubject).forEach((subject) => {
    const score = Math.round((subject.correct / subject.total) * 100);
    const isMastered = score >= 80;
    const card = (
      <motion.div
        key={subject.subjectId}
        className={`subject-card ${isMastered ? "mastered" : ""}`}
        whileHover={{ y: -5 }}
        onClick={() => navigate(`/progression/subject/${subject.subjectId}`)}
      >
        <div className="progress-header">
          <h3>{subject.label}</h3>
          <div className={`score ${isMastered ? "mastered" : ""}`}>{score}%</div>
        </div>
        <div className="subject-details">
          <span>{subject.count} chapitre(s)</span>
          <div className="progress-bar">
            <div
              className={`progress-fill ${isMastered
                ? "bg-success"
                : score >= 70
                  ? "bg-primary"
                  : "bg-warning"
                }`}
              style={{ width: `${score}%` }}
            ></div>
          </div>
        </div>
      </motion.div>
    );
    if (isMastered) mastered.push(card);
    else notMastered.push(card);
  });


  return (
    <div className="progression-container">
      <Navbar />

      <div className="progression-header text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="page-title-progression"
        >
          My Subject Progression
        </motion.h1>
      </div>

      {/* Section des 3 cartes de statistiques */}
      <div className="stats-section">
        <motion.div
          className="stats-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="stat-card"
            whileHover={{ y: -5 }}
          >
            <div className="stat-icon mastered">
              <svg viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>
            <h3>Mastered Subjects</h3>
            <p className="stat-number">{masteredSubjects}</p>
            <p className="stat-description">Score ≥ 80%</p>
          </motion.div>

          <motion.div
            className="stat-card highlight"
            whileHover={{ y: -5 }}
          >
            <div className="stat-icon progress">
              <svg viewBox="0 0 24 24">
                <path d="M13 2.03v2.02c4.39.54 7.5 4.53 6.96 8.92-.46 3.64-3.32 6.53-6.96 6.96v2c5.5-.55 9.5-5.43 8.95-10.93-.45-4.75-4.22-8.5-8.95-8.97m-2 .03c-1.95.19-3.81.94-5.33 2.2L7.1 5.74c1.12-.9 2.47-1.48 3.9-1.68v-2M4.26 5.67C2.82 7.6 2 9.77 2 12c0 5.52 4.48 10 10 10v-2c-4.42 0-8-3.58-8-8 0-1.78.59-3.42 1.58-4.74l-1.32-1.59M11 18v-2l3.5-3.5-1.42-1.42L11 14.17l-2.08-2.09-1.42 1.42 3.5 3.5z" />
              </svg>
            </div>
            <h3>Overall Progress</h3>
            <p className="stat-number">{overallProgressPercent}%</p>
            <p className="stat-description">{masteredSubjects}/{totalSubjects} subjects</p>
          </motion.div>

          <motion.div
            className="stat-card"
            whileHover={{ y: -5 }}
          >
            <div className="stat-icon total">
              <svg viewBox="0 0 24 24">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
              </svg>
            </div>
            <h3>Total Subjects</h3>
            <p className="stat-number">{totalSubjects}</p>
            <p className="stat-description">Total</p>
          </motion.div>
        </motion.div>
      </div>



      {/* 🔥 Nouvelle disposition */}
      <div className="dual-columns">
        <div className="column">
          <h3 className="section-title green">🏅 Mastered Subjects</h3>
          <div className="progression-grid">{mastered}</div>
        </div>
        <div className="column">
          <h3 className="section-title blue">📘 Subjects to Improve</h3>
          <div className="progression-grid">{notMastered}</div>
        </div>
      </div>


    </div>
  );
}

export default Progression;