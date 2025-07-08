import { useLocation } from "react-router-dom";
import "../pages/styles/ExamResult.css";
import Navbar from "../components/Navbar";

export default function ExamResult() {
  const { state } = useLocation(); // { score, total, feedback }

  if (!state) {
    return (
      <div className="exam-result-container">
        <p className="no-result">No result found.</p>
      </div>
    );
  }

  const percentage = Math.round((state.score / state.total) * 100);

  return (
    <div className="exam-result-container">
      <Navbar />
      <div className="result-header">
        <h2>Exam Results</h2>
        <div className="score-display">
          <div className="score-circle">
            <span className="score-percent">{percentage}%</span>
          </div>
        </div>
      </div>

      <div className="feedback-section">
        <h3>Answer Details</h3>
        <ul className="feedback-list">
          {state.feedback.map((f, i) => (
            <li key={i} className={`feedback-item ${f.correct ? "correct" : "incorrect"}`}>
              <div className="feedback-content">
                <p className="feedback-question">{f.question}</p>
                <p className="feedback-answer">
                  <span>Your answer:</span> {f.answer || "—"}
                </p>
                {!f.correct && (
                  <p className="feedback-correct-answer">
                    <span>Correct answer:</span> {f.expected}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
