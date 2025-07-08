import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import socket from "./socket";
import "../pages/styles/LiveGame.css";
import Navbar from "../components/Navbar.jsx";

export default function LiveGame() {
  const { roomId } = useParams();
  const { state } = useLocation();
  const playerName = state?.playerName;
  const courseId = state?.courseId;

  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [remainingTime, setRemainingTime] = useState(20);
  const [players, setPlayers] = useState([]);
  const [coachMessage, setCoachMessage] = useState("");
  const [quizEnded, setQuizEnded] = useState(false);
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    if (!courseId || !roomId) return;
    socket.emit("initQuiz", { roomId, courseId });
  }, [courseId, roomId]);

  useEffect(() => {
    socket.on("question", ({ data, time }) => {
      setQuestion(data);
      setSelected(null);
      setRemainingTime(time || 10);
      setCoachMessage("");
    });

    socket.on("quizEnd", (ranking) => {
      setRanking(ranking);
      setQuizEnded(true);
    });

    socket.on("coachMessage", ({ text }) => {
      setCoachMessage(text);
    });

    socket.on("roomUpdate", ({ players }) => {
      setPlayers(players);
    });

    return () => {
      socket.off("question");
      socket.off("quizEnd");
      socket.off("coachMessage");
      socket.off("roomUpdate");
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAnswer = (choice) => {
    setSelected(choice.text);
    socket.emit("answer", { correct: choice.correct, playerName });
    if (choice.correct) setScore((prev) => prev + 10);
  };

  if (quizEnded) {
    return (
      <div className="game-container-end">

        <Navbar />
        <div className="decoration-element decor-1"></div>
        <div className="decoration-element decor-2"></div>
        <div className="decoration-element decor-3"></div>

        <div className="quiz-end-card">
          <h2 className="quiz-end-title">
            <span className="icon">🏆</span> Quiz Done
          </h2>

          {/* Podium visuel */}
          <div className="podium-container">
          
            {ranking.length >= 1 && (
              <div className="podium-place">
                <div className="podium-stand first">1</div>
                <div className="podium-label">{ranking[0]?.name}</div>
              </div>
            )}
              {ranking.length >= 2 && (
              <div className="podium-place">
                <div className="podium-stand second">2</div>
                <div className="podium-label">{ranking[1]?.name}</div>
              </div>
            )}


            {ranking.length >= 3 && (
              <div className="podium-place">
                <div className="podium-stand third">3</div>
                <div className="podium-label">{ranking[2]?.name}</div>
              </div>
            )}
          </div>


          <h3 className="ranking-title">Final Rankings</h3>

          <ul className="ranking-list">
            {ranking.map((p, i) => (
              <li key={p.id} className={`ranking-item ${p.name === playerName ? 'current-player' : ''}`}>
                <span className="player-position">{i + 1}</span>
                <span className="player-name">{p.name}</span>
                <span className="player-score">{p.score} pts</span>
              </li>
            ))}
          </ul>

          {coachMessage && (
            <div className="coach-message">
              <span className="icon">💡</span>
              <span>Coach: {coachMessage}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="game-container">
        <Navbar />
        <div className="decoration-element decor-1"></div>
        <div className="decoration-element decor-2"></div>
        <div className="decoration-element decor-3"></div>
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <Navbar />
      <div className="decoration-element decor-1"></div>
      <div className="decoration-element decor-2"></div>
      <div className="decoration-element decor-3"></div>
      <div className="game-card">
        <div className="game-header">
          <h2 className="game-title">
            <span className="icon">🧠</span> Question
          </h2>
          <div className={`timer ${remainingTime <= 5 ? 'warning' : ''}`}>
            ⏳ {remainingTime}s
          </div>
        </div>

        <p className="question-text">{question.title}</p>

        <div className="choices-grid">
          {question.choices.map((c, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(c)}
              className={`choice-button ${selected === c.text
                ? c.correct
                  ? 'correct'
                  : 'incorrect'
                : ''
                } ${selected ? 'disabled' : ''}`}
              disabled={!!selected}
            >
              {c.text}
            </button>
          ))}
        </div>

        <div className="players-panel">
          <h3 className="panel-title">
            <span className="icon">👥</span> Players
          </h3>
          <ul className="players-list">
            {players.map((p) => (
              <li key={p.id} className={`player-item ${p.name === playerName ? 'current-player' : ''}`}>
                <span className="player-name">{p.name}</span>
                <span className="player-score">{p.score} pts</span>
              </li>
            ))}
          </ul>
        </div>

        {coachMessage && (
          <div className="coach-message">
            <span className="icon">💡</span> Coach: {coachMessage}
          </div>
        )}
      </div>
    </div>
  );
}