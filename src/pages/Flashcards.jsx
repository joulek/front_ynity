import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../pages/styles/flashcards.css";
import Navbar from "../components/Navbar";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { motion } from "framer-motion";

export default function Flashcards() {
  const { id: courseId } = useParams();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [current, setCurrent] = useState(0);
  const [picked, setPicked] = useState({});
  const posted = useRef(false);

  // ───── Load user
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/user`, {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  // ───── Load flashcards
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/flashcards/${courseId}`,
          { credentials: "include" }
        );
        const data = await res.json();
        setCards(data);
      } catch (e) {
        console.error("Error loading flashcards:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [courseId]);

  // ───── Save attempt
  const allAnswered =
    cards.length > 0 && Object.keys(picked).length === cards.length;

  useEffect(() => {
    if (!allAnswered || !user || posted.current) return;
    posted.current = true;

    const flashcardResults = cards.map((fc, idx) => {
      const choice = picked[idx];
      return {
        flashcard: fc._id,
        correct: fc.answer === choice,
      };
    });

    const total = cards.length;
    const correct = flashcardResults.filter((r) => r.correct).length;
    const score = (correct / total) * 100;

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/attempts`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId, total, correct, flashcardResults }),
    })
      .then((res) => res.json())
      .then(() => {
        console.log("✅ Attempt saved");

        // 🟢 Notification progression si score >= 80%
        if (score >= 80) {
          fetch(
            `${
              import.meta.env.VITE_BACKEND_URL
            }/api/notifications/check-progress`,
            {
              method: "POST",
              credentials: "include",
            }
          )
            .then((res) => res.json())
            .then((data) => console.log("🎉 Progress notification:", data))
            .catch((err) => console.warn("⚠️ Failed to notify progress:", err));
        }

        // 🔴 Notification score faible si score < 50%
        else if (score < 50) {
          fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/notifications/low-score`,
            {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                courseTitle: cards[0]?.course?.title || "This course",
                score: Math.round(score),
                attemptId: null, // Peut être modifié si besoin
              }),
            }
          )
            .then((res) => res.json())
            .then((data) => console.log("⚠️ Low score notification:", data))
            .catch((err) =>
              console.warn("⚠️ Failed to notify low score:", err)
            );
        }
      })
      .catch((err) => console.error("Error saving attempt:", err));
  }, [allAnswered, user, cards, picked, courseId]);

  // ───── UI helpers
  const isRight = (idx, answer) => cards[idx]?.answer === answer;

  const pick = (idx, choice) => {
    if (picked[idx]) return;
    setPicked((p) => ({ ...p, [idx]: choice }));

    setTimeout(() => {
      setCurrent((c) => (c + 1 < cards.length ? c + 1 : c));
    }, 1200);
  };

  const restart = () => {
    setPicked({});
    setCurrent(0);
    posted.current = false;
  };

  // ───── Render
  if (loading) return <div>Loading…</div>;
  if (!cards.length)
    return <div className="no-cards">No flashcards available.</div>;

  const card = cards[current];
  const answered = picked[current];
  const correct = answered && isRight(current, answered);
  const score = Object.entries(picked).filter(([i, a]) =>
    isRight(+i, a)
  ).length;

  return (
    <div className="flashcards-app">
      <Navbar />

      {/* Header */}
      <header className="flashcards-header">
        <h1 className="flashcards-title">Flashcards</h1>
        <Link to="/Subjects" className="back-link">
          <span className="back-arrow">←</span> Back
        </Link>
      </header>

      {/* Progress bar */}
      {!allAnswered && (
        <div className="progress-container">
          <div
            className="progress-bar"
            style={{ width: `${(current / cards.length) * 100}%` }}
          />
          <span className="progress-text">
            Card {current + 1} of {cards.length}
          </span>
        </div>
      )}

      {/* Quiz phase */}
      {!allAnswered ? (
        <div className="flashcard-container">
          <article className={`flashcard ${answered ? "answered" : ""}`}>
            <div className="card-content">
              <p className="flashcard-question">{card.question}</p>

              <div className="flashcard-choices">
                {card.choices.map((choice, i) => {
                  const pickedThis = answered === choice;
                  const className = [
                    "choice-btn",
                    pickedThis && correct && "correct",
                    pickedThis && !correct && "incorrect",
                    answered && !pickedThis && "disabled",
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <button
                      key={i}
                      disabled={!!answered}
                      onClick={() => pick(current, choice)}
                      className={className}
                    >
                      <span className="choice-letter">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="choice-text">{choice}</span>

                      {pickedThis && (
                        <span className="choice-feedback">
                          {correct ? "✓" : "✗"}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {answered && (
              <div
                className={`feedback-message ${
                  correct ? "correct-feedback" : "incorrect-feedback"
                }`}
              >
                {correct ? (
                  <>
                    <FiCheckCircle style={{ color: "green" }} />
                    Correct answer!
                  </>
                ) : (
                  <>
                    <FiXCircle style={{ color: "#EF4444" }} />
                    Wrong answer
                  </>
                )}
              </div>
            )}
          </article>
        </div>
      ) : (
        // Result screen
        <motion.div
          className="result-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="result-decoration deco-1">✨</span>
          <span className="result-decoration deco-2">✨</span>

          <h2 className="result-title">Quiz Result</h2>

          <motion.div
            className="result-score floating"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {score} / {cards.length}
          </motion.div>

          <p className="result-message">
            {score === cards.length
              ? "Congratulations! 🏆 Perfect score!"
              : score >= cards.length * 0.7
              ? "Great job! 👏 You're on the right track"
              : "Keep practicing! 💪 You're getting there"}
          </p>

          <div className="result-actions">
            <motion.button
              onClick={restart}
              className="primary-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
              </svg>
              Play again
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
