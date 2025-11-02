import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/styles/Planning.css";
import Navbar from "../components/Navbar";

function Planning() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [title, setPlanningName] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [weights, setWeights] = useState({});
  const [chaptersBySubject, setChaptersBySubject] = useState({});
  const [selectedChapters, setSelectedChapters] = useState({});
  const [nbJours, setNbJours] = useState(10);
  const [exams, setExams] = useState([{ date: "", type: "QCM" }]);
  const [isLoading, setIsLoading] = useState(false); // 🔥 Nouvel état

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/subject`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setSubjects(data);
        const initialWeights = {};
        data.forEach((s) => (initialWeights[s._id] = 1));
        setWeights(initialWeights);
      })
      .catch((err) => console.error("Error charging subjects :", err));
  }, []);

  useEffect(() => {
    const selected = [...selectedSubjects];
    if (selected.includes("all")) return;

    selected.forEach(async (subjectId) => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/course/by-subject/${subjectId}`, {
        credentials: "include",
      });
      const data = await res.json();
      setChaptersBySubject((prev) => ({ ...prev, [subjectId]: data }));
    });
  }, [selectedSubjects]);

  const handleGeneratePlanning = async () => {
    setIsLoading(true); // 🔥 Commence le chargement
    let cleanedCourses = [];
    const cleanedExams = exams.map((exam) => ({
      date: new Date(exam.date).toISOString(),
      type: exam.type,
    }));

    try {
      if (selectedSubjects.includes("all")) {
        for (let sub of subjects) {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/course/by-subject/${sub._id}`, {
            credentials: "include",
          });
          const subjectCourses = await res.json();
          subjectCourses.forEach((c) => {
            cleanedCourses.push({
              id: c._id,
              title: c.title,
              weight: weights[sub._id] || 1,
              summaryExists: !!c.summaryText,
              subjectId: sub._id,
              subjectLabel: c.subject?.label || c.subject?.title || c.subject?.label,
            });
          });
        }
      } else {
        for (let subjectId of selectedSubjects) {
          const selected = selectedChapters[subjectId] || [];
          const subject = subjects.find((s) => s._id === subjectId);
          selected.forEach((c) => {
            cleanedCourses.push({
              id: c._id,
              title: c.title,
              weight: weights[subjectId] || 1,
              summaryExists: !!c.summaryText,
              subjectId,
              subjectLabel: c.subject?.label || c.subject?.title || c.subject?.label,
            });
          });
        }
      }

      const payload = {
        totalDays: parseInt(nbJours),
        title,
        courses: cleanedCourses,
        exams: cleanedExams,
      };

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/planning/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to generate");
      const data = await res.json();
      navigate("/planning/result", {
        state: { planning: data.planning, title: data.title },
      });
    } catch (err) {
      console.error("Failed to generate the schedule :", err);
      alert("❌ Failed to generate the schedule.");
    } finally {
      setIsLoading(false); // 🔥 Arrête le chargement
    }
  };

  return (
    <>
      <Navbar />
      {/* 🔄 Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <span className="spinner" />
            <p>Loading...</p>
          </div>
        </div>
      )}
      <div className="planning-container">
        <div className="planning-header">
          <h2>Schedule Generator</h2>
          <div className="progress-steps">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`step ${i === step ? "active" : ""} ${i < step ? "completed" : ""}`}
              >
                <div className="step-number">{i}</div>
                <div className="step-label">
                  {i === 1 && "Name"}
                  {i === 2 && "Days"}
                  {i === 3 && "Subjects"}
                  {i === 4 && "Exams"}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="planning-content">
          {step === 1 && (
            <div className="step-content fade-in">
              <h3>Name your schedule</h3>
              <input
                type="text"
                value={title}
                onChange={(e) => setPlanningName(e.target.value)}
                className="form-input"
                placeholder="Ex: Final Revision 2025"
              />
            </div>
          )}

          {step === 2 && (
            <div className="step-content fade-in">
              <h3>Number of available days</h3>
              <input
                type="number"
                min="1"
                value={nbJours}
                onChange={(e) => setNbJours(parseInt(e.target.value))}
                className="form-input"
              />
            </div>
          )}

          {step === 3 && (
            <div className="step-content fade-in">
              <h3>Select Subjects</h3>
              <p>Select the subjects to include in your schedule:</p>

              <div className="subject-selection">
                {/* Checkbox toutes les matières */}
                <label className="subject-option">
                  <input
                    type="checkbox"
                    checked={
                      selectedSubjects.includes("all") ||
                      selectedSubjects.length === subjects.length
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedSubjects(["all", ...subjects.map((s) => s._id)]);
                      } else {
                        setSelectedSubjects([]);
                      }
                    }}
                  />
                  <span className="checkmark"></span>
                  <span className="subject-label">All subjects</span>
                </label>

                {/* Checkbox pour chaque matière */}
                {subjects.map((s) => (
                  <label key={s._id} className="subject-option">
                    <input
                      type="checkbox"
                      checked={selectedSubjects.includes(s._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          const newSelection = selectedSubjects.includes("all")
                            ? [s._id]
                            : [...selectedSubjects.filter((id) => id !== "all"), s._id];
                          setSelectedSubjects(newSelection);
                        } else {
                          const newSelection = selectedSubjects.filter(
                            (id) => id !== s._id && id !== "all"
                          );
                          setSelectedSubjects(newSelection);
                        }
                      }}
                    />
                    <span className="checkmark"></span>
                    <span className="subject-label">{s.label}</span>
                  </label>
                ))}
              </div>

              {/* Pondération et chapitres */}
              {selectedSubjects.length > 0 &&
                (selectedSubjects.includes("all") ? (
                  <div className="weight-controls">
                    <h4>Pondération par matière</h4>
                    {subjects.map((s) => (
                      <div key={s._id} className="weight-control">
                        <label>{s.label}</label>
                        <input
                          type="number"
                          min="1"
                          value={weights[s._id] || 1}
                          onChange={(e) =>
                            setWeights({
                              ...weights,
                              [s._id]: parseInt(e.target.value) || 1,
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  selectedSubjects.map((subjectId) => {
                    const subject = subjects.find((s) => s._id === subjectId);
                    return (
                      <div key={subjectId} className="subject-block">
                        <div className="weight-control">
                          <label>Weight per subject {subject?.label}</label>
                          <input
                            type="number"
                            min="1"
                            value={weights[subjectId] || 1}
                            onChange={(e) =>
                              setWeights({
                                ...weights,
                                [subjectId]: parseInt(e.target.value) || 1,
                              })
                            }
                          />
                        </div>

                        <h4>Chapters to revise</h4>
                        <div className="courses-list">
                          {(chaptersBySubject[subjectId] || []).map((c) => (
                            <label key={c._id} className="course-item">
                              <input
                                type="checkbox"
                                checked={
                                  (selectedChapters[subjectId] || []).some(
                                    (sc) => sc._id === c._id
                                  )
                                }
                                onChange={() => {
                                  const prev = selectedChapters[subjectId] || [];
                                  const updated = prev.some((sc) => sc._id === c._id)
                                    ? prev.filter((sc) => sc._id !== c._id)
                                    : [...prev, c];
                                  setSelectedChapters({
                                    ...selectedChapters,
                                    [subjectId]: updated,
                                  });
                                }}
                              />
                              <span className="checkmark"></span>
                              <span className="courses-title">{c.title}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })
                ))}
            </div>
          )}


          {step === 4 && (
            <div className="step-content fade-in">
              <h3>Scheduled Exams</h3>
              {exams.map((exam, idx) => (
                <div key={idx} className="exam-item-planning">
                  <div className="date-input-container">
                    <input
                      type="datetime-local"
                      className="exam-date-planning"
                      value={exam.date}
                      onChange={(e) => {
                        const updated = [...exams];
                        updated[idx].date = e.target.value;
                        setExams(updated);
                      }}
                    />
                  </div>
                  <button
                    onClick={() => setExams(exams.filter((_, i) => i !== idx))}
                    className="remove-btn"
                  >
                    Delete
                  </button>
                </div>
              ))}
              <button
                onClick={() => setExams([...exams, { date: "", type: "QCM" }])}
                className="add-btn"
              >
                <span style={{ fontSize: "1.3rem", marginRight: "6px" }}>➕</span>
                Add an exam
              </button>
            </div>
          )}
        </div>

        <div className="planning-actions">
          {step > 1 && (
            <button
              onClick={() => setStep((prev) => prev - 1)}
              className="btn-prev"
            >
              Previous
            </button>
          )}
          {step < 4 ? (
            <button
              onClick={() => setStep((prev) => prev + 1)}
              className="btn-primary"
              disabled={
                (step === 1 && !title.trim()) ||
                (step === 3 && selectedSubjects.length === 0)
              }
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleGeneratePlanning}
              className="btn-generate"
              disabled={selectedSubjects.length === 0}
            >
              Generate Schedule
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default Planning;