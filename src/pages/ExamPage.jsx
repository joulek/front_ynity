// src/pages/ExamPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar";
import "../pages/styles/ExamPage.css";

function ExamPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [timerActive, setTimerActive] = useState(false);

  // Load Exam + Init Timer
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/exam/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setExam(data);
        setAnswers(data.questions.map(() => ({ answer: "" })));

        // ⏳ 1 min/question
        const totalSeconds = data.questions.length * 60;
        setTimeLeft(totalSeconds);
        setTimerActive(true);
      })
      .catch((err) => console.error("Error loading exam:", err));
  }, [id]);

  // Timer Countdown
  useEffect(() => {
    if (!timerActive || timeLeft === null) return;

    if (timeLeft === 0) {
      setTimerActive(false);
      Swal.fire({
        icon: "info",
        title: "⏰ Temps écoulé !",
        text: "Votre examen va être soumis automatiquement.",
        showConfirmButton: false,
        timer: 3000
      });
      handleSubmit(); // 🧠 Auto-submit
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, timerActive]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleChange = (i, value) => {
    const updated = [...answers];
    updated[i].answer = value;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/exam/${id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ answers }),
      });

      const result = await res.json();
      Swal.fire({
        icon: "success",
        title: `Score: ${result.score}/${result.total}`,
        confirmButtonText: "View details",
        customClass: {
          title: 'text-2xl font-bold text-gray-800',
          confirmButton: 'bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow'
        }
      }).then(() => navigate(`/exam/${id}/result`, { state: result }));
    } catch (err) {
      console.error("Submission error:", err);
      Swal.fire({
        title: "Error",
        text: "Submission failed",
        icon: "error",
        customClass: {
          title: 'text-2xl font-bold text-gray-800'
        }
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!exam) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading exam...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="exam-container">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="exam-card">
          <h1 className="exam-title">Exam: {exam.type}</h1>
          <p className="exam-desc">Answer all questions before submitting</p>

          {/* Timer visible */}
          <div className="text-right text-xl font-bold text-red-600 mb-4">
            ⏳ Temps restant : {formatTime(timeLeft || 0)}
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            {exam.questions.map((q, i) => (
              <div key={i} className="question-block">
                <p className="question-title">
                  <span className="question-index">{i + 1}</span>
                  {q.question}
                </p>

                {q.type === "QCM" ? (
                  <div className="mt-4 ml-11 space-y-2">
                    {q.options.map((opt, idx) => (
                      <label key={idx} className="radio-option ml-2">
                        <div className={`${answers[i].answer === opt ? 'selected' : ''}`} />
                        <input
                          type="radio"
                          name={`q-${i}`}
                          value={opt}
                          checked={answers[i].answer === opt}
                          onChange={(e) => handleChange(i, e.target.value)}
                          className="sr-only"
                        />
                        <span className="radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 ml-11">
                    <textarea
                      className="textarea-answer"
                      rows="4"
                      placeholder="Your answer..."
                      value={answers[i].answer}
                      onChange={(e) => handleChange(i, e.target.value)}
                    ></textarea>
                  </div>
                )}
              </div>
            ))}

            <div className="flex justify-end mt-8">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className={`submit-button ${submitting ? 'submitting' : ''}`}
              >
                {submitting ? (
                  <>
                    <svg className="submit-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : "Submit Exam"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ExamPage;
