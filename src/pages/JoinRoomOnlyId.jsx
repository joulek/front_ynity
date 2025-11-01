import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "./socket";
import { UserContext } from "../context/UserContext";
import "../pages/styles/JoinRoomOnlyId.css";
import Navbar from "../components/Navbar.jsx";
import quizIllustration from "../assets/create-room.jpg";

export default function JoinRoomOnlyId() {
  const [roomId, setRoomId] = useState("");
  const [hasJoined, setHasJoined] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const handleJoin = () => {
    if (!roomId || !user?.name) return alert("Missing room ID or username");
    socket.emit("joinRoom", { roomId, playerName: user.name });
    setHasJoined(true);
  };

  const handleReady = () => {
    socket.emit("ready", { roomId, playerName: user.name });
    navigate(`/lobby/${roomId}`);
  };

  return (
    <div className="join-room-container">
      <Navbar />
      <div className="decoration-element decor-1"></div>
      <div className="decoration-element decor-2"></div>
      <div className="decoration-element decor-3"></div>

      <div className="join-room-split-layout">
        {/* Left Section - Illustration */}
        <div className="illustration-section">
          <div className="illustration-content">
            <img 
              src={quizIllustration} 
              alt="Live Quiz Illustration" 
              className="main-illustration"
            />
            <div className="illustration-overlay">
              <h2>Challenge Your Friends!</h2>
              <p>Join a game room and test your knowledge in real-time</p>
            </div>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="form-section">
          <div className="form-container">
            <h1 className="page-title">Ready to Play?</h1>
            <p className="page-subtitle">Join your game room to start the challenge</p>
            
            <div className="join-form-card">
              <div className="form-header">
                <span className="form-icon">🚪</span>
                <h2>Join a Game Room</h2>
              </div>

              {!hasJoined ? (
                <>
                  <div className="form-group">
                    <label htmlFor="roomId">Room ID</label>
                    <input
                      type="text"
                      id="roomId"
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value)}
                      placeholder="e.g. abc123"
                    />
                  </div>
                  <button className="primary-button" onClick={handleJoin}>
                    <span>Join Now</span>
                    <span className="button-icon">→</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="success-message">
                    <span className="success-icon">✓</span>
                    Successfully joined room: <strong>{roomId}</strong>
                  </div>
                  <button className="primary-button ready-button" onClick={handleReady}>
                    <span>I'm Ready</span>
                    <span className="button-icon">👍</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}