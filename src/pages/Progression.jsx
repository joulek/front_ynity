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
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="loading-circle"
        />
        <p className="loading-text">
          🧠 Our AI is analyzing your revision data...
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
              className={`progress-fill ${
                isMastered
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

      <div className="stats-section">
        <motion.div
          className="stats-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div className="stat-card" whileHover={{ y: -5 }}>
            <div className="stat-icon mastered">
              ✅
            </div>
            <h3>Mastered Subjects</h3>
            <p className="stat-number">{masteredSubjects}</p>
            <p className="stat-description">Score ≥ 80%</p>
          </motion.div>

          <motion.div className="stat-card highlight" whileHover={{ y: -5 }}>
            <div className="stat-icon progress">📊</div>
            <h3>Overall Progress</h3>
            <p className="stat-number">{overallProgressPercent}%</p>
            <p className="stat-description">
              {masteredSubjects}/{totalSubjects} subjects
            </p>
          </motion.div>

          <motion.div className="stat-card" whileHover={{ y: -5 }}>
            <div className="stat-icon total">📚</div>
            <h3>Total Subjects</h3>
            <p className="stat-number">{totalSubjects}</p>
            <p className="stat-description">Total</p>
          </motion.div>
        </motion.div>
      </div>

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
