import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../pages/styles/SubjectProgression.css";
import { motion } from "framer-motion";

function SubjectProgression() {
  const { id } = useParams();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chapters, setChapters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [examValidated, setExamValidated] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/exam/my-attempts`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(async (data) => {
        console.log("📥 Réponse reçue depuis /api/exam/my-attempts :", data);

        if (!Array.isArray(data)) {
          console.error("❌ Les données reçues ne sont pas un tableau :", data);
          return;
        }

        const courseRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/course/by-subject/${id}`, {
          credentials: "include",
        });

        const subjectCourses = await courseRes.json();
        const courseIds = subjectCourses.map(c => c._id);

        console.log("📚 Cours liés à la matière :", subjectCourses);
        console.log("📘 IDs des cours :", courseIds);

        const validated = data.some(attempt =>
          (attempt.score / attempt.total) >= 0.8 &&  // ✅ 80%
          courseIds.includes(attempt.course?.toString())
        );


        console.log("✅ Est-ce qu’un examen avec score >= 80 est trouvé ?", validated);

        setExamValidated(validated);
      })
      .catch((err) => {
        console.error("❌ Erreur lors de la vérification des examens :", err);
      });
  }, [id]);


  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/attempts/my`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (a) => a.subject?._id === id && typeof a.correct === "number" && typeof a.total === "number"
        );
        setAttempts(filtered);

        const uniqueChapters = [...new Set(filtered.map(a => a.course?.title))].filter(Boolean);
        setChapters(uniqueChapters);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const filteredAttempts = attempts.filter(attempt =>
    attempt.course?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    new Date(attempt.createdAt).toLocaleDateString().includes(searchTerm)
  );

  const handleDelete = async (attemptId) => {
    const confirm = window.confirm("Voulez-vous supprimer cette tentative ?");
    if (!confirm) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/attempts/${attemptId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Échec de la suppression");
      setAttempts((prev) => prev.filter((a) => a._id !== attemptId));
    } catch (err) {
      alert("Erreur : " + err.message);
    }
  };

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <p>Loading your data...</p>
    </div>
  );

  if (attempts.length === 0 && !examValidated) {
    return (
      <div className="empty-state-container">
        <Navbar />
        <div className="empty-state">
          <h2>No attempts for this subject</h2>
          <Link to="/progression" className="back-link">← Back to progression</Link>
        </div>
      </div>
    );
  }

  const totalChapters = chapters.length;
  const masteredChapters = attempts.filter(a => (a.correct / a.total) >= 0.8).length;
  const progressPercent = totalChapters > 0 ? Math.round((masteredChapters / totalChapters) * 100) : 0;

  return (
    <div className="progression-container">
      <Navbar />

      <motion.div className="page-header-subject-progression" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="page-title-subject-progression">
          <span className="subject-label">Progression :</span>
          <span className="subject-name">{attempts[0]?.subject?.label || "Inconnue"}</span>
        </h1>
      </motion.div>

      <motion.div className="progress-overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
        <div className="progress-card">
          <div className="progress-stats">
            <div className="stat-item">
              <span className="stat-number">{masteredChapters}</span>
              <span className="stat-label">Mastered Chapters</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{totalChapters}</span>
              <span className="stat-label">Total Chapters</span>
            </div>
            <div className="stat-item highlight">
              <span className="stat-number">{progressPercent}%</span>
              <span className="stat-label">Progression</span>
            </div>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      </motion.div>

      {examValidated && (
        <div className="exam-validation-status">
          <p className="text-green-600 font-bold text-lg">
            ✅ Final exam passed! Subject fully mastered!
          </p>
        </div>
      )}

      <motion.div className="graduation-timeline-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
        <h2 className="section-title">Learning Journey</h2>
        <div className="graduation-timeline">
          {chapters.map((chapter, index) => {
            const isCompleted = attempts.some(
              a => a.course?.title === chapter && (a.correct / a.total) >= 0.8
            );
            const isActive = !isCompleted && index <= masteredChapters;

            return (
              <motion.div key={index} whileHover={{ scale: 1.05 }} className={`graduation-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                <div className="graduation-circle">
                  {isCompleted ? (
                    <svg className="check-icon" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="graduation-label">{chapter}</div>
                {isCompleted && <div className="completion-badge">Mastered</div>}
              </motion.div>
            );
          })}

          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`graduation-step exam ${examValidated ? 'completed' : ''}`}
          >
            <div className={`graduation-circle ${examValidated ? 'green-exam' : ''}`}>
              <svg className="exam-icon" viewBox="0 0 24 24">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
              </svg>
            </div>
            <div className="graduation-label">Final Exam</div>
            {examValidated && <div className="completion-badge">Passed</div>}
          </motion.div>

        </div>
      </motion.div>

      <motion.div className="attempts-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}>
        {filteredAttempts.length === 0 ? (
          <div className="no-results">
            <p>No attempts match your search</p>
          </div>
        ) : (
          <div className="attempts-grid">
            {filteredAttempts.map((a) => {
              const score = Math.round((a.correct / a.total) * 100);
              const isMastered = score >= 80;
              return (
                <motion.div key={a._id} whileHover={{ y: -5 }} className={`attempt-card ${isMastered ? 'mastered' : ''}`}>
                  <div className="card-header">
                    <h3 className="course-title">{a.course?.title}</h3>
                    <div className={`score-badge ${isMastered ? 'mastered' : ''}`}>{score}%</div>
                  </div>
                  <div className="card-body">
                    <div className="attempt-info">
                      <span className="info-label">Date :</span>
                      <span>{new Date(a.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="attempt-info">
                      <span className="info-label">Score :</span>
                      <span>{a.correct} / {a.total}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default SubjectProgression;
