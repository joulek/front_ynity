import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import socket from "./socket";
import Navbar from "../components/Navbar.jsx";
import "../pages/styles/LobbyLive.css";
import trophyIcon from "../assets/trophy.png";


export default function LiveLobby() {
  const { roomId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const playerName = state?.playerName;
  const courseId = state?.courseId;

  const [players, setPlayers] = useState([]);
  const [ready, setReady] = useState(false);
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    socket.on("roomUpdate", (room) => setPlayers(room.players));
    socket.on("startQuiz", () => {
      navigate(`/live/${roomId}`, { state: { playerName, courseId } });
    });
    socket.on("countdown", (seconds) => {
      setCountdown(seconds);
    });

    return () => {
      socket.off("roomUpdate");
      socket.off("startQuiz");
      socket.off("countdown");
    };
  }, [roomId, playerName, courseId, navigate]);

  const handleReady = () => {
    setReady(true);
    socket.emit("playerReady", { roomId, courseId });
  };

  return (
    <div className="live-lobby-container">
      <Navbar />

      {/* Decoration elements */}
      <div className="decoration-element decor-1"></div>
      <div className="decoration-element decor-2"></div>

      {/* Hero Section */}
      <div className="lobby-hero">
        <h1 className="lobby-hero-title">
          <span className="hero-highlight">Game Room</span> created!
        </h1>
        <p className="lobby-hero-subtitle">
          Get ready for an exciting revision battle!
        </p>
      </div>

      {/* Main Content */}
      <div className="lobby-content">
        <div className="lobby-card-wrapper">
          <div className="lobby-card-glow"></div>
          <div className="lobby-card">
            <div className="room-header">
              <div className="room-info">
                <h2 className="room-title">
                  <span className="icon">🎮</span>
                  <span className="room-code">{roomId}</span>
                </h2>
              </div>

              {countdown && (
                <div className="countdown-bubble pulse-animation">
                  <span className="countdown-text">Starting in</span>
                  <span className="countdown-value">{countdown}s</span>
                </div>
              )}
            </div>

            <div className="players-section">
              <h3 className="section-title">
                <span className="title-icon">👥</span> Players
              </h3>
              <div className="players-list">
                {players.map((p, i) => (
                  <div key={i} className={`player-card ${p.ready ? 'ready' : ''}`}>
                    <div className="player-avatar">
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="player-details">
                      <span className="player-name">{p.name}</span>
                      <span className="player-status">
                        {p.ready ? 'Ready to play' : 'Waiting...'}
                      </span>
                    </div>
                    <div className={`player-status-icon ${p.ready ? 'ready' : ''}`}>
                      {p.ready ? '✅' : '⏳'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lobby-actions">
              {!ready ? (
                <button className="ready-button pulse-animation" onClick={handleReady}>
                  <span className="btn-icon">👍</span>
                  <span className="btn-text">I'M READY!</span>
                  <span className="btn-hover-effect"></span>
                </button>
              ) : (
                <div className="waiting-message">
                  <div className="loading-spinner"></div>
                  <p>Waiting for other players...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lobby-footer">
          <div className="footer-card">
            <img src={trophyIcon} alt="Trophy" className="footer-icon" />
            <p>
              The quiz will start automatically when all players are ready.
              <br />
              Be the fastest to answer to earn bonus points!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
