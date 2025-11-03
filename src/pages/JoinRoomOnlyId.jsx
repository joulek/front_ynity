import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "./socket";
import { UserContext } from "../context/UserContext";
import Navbar from "../components/Navbar.jsx";
import quizIllustration from "../assets/create-room.jpg";
import "../pages/styles/JoinRoomOnlyId.css";

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
    <div className="join-room-page">
      <Navbar />

      {/* Background Circles */}
      <div className="decor decor-1"></div>
      <div className="decor decor-2"></div>
      <div className="decor decor-3"></div>

      <div className="join-room-card">

        {/* Image Side */}
        <div className="join-left">
          <img src={quizIllustration} alt="Quiz" className="join-illustration" />
          <h2>Challenge Your Friends!</h2>
          <p>Join a live quiz room and test your knowledge 🚀</p>
        </div>

        {/* Form Side */}
        <div className="join-right">
          <h1 className="join-title">Ready to Play?</h1>
          <p className="join-subtitle">Enter your room ID to join the challenge</p>

          {!hasJoined ? (
            <>
              <input
                type="text"
                placeholder="Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />
              <button className="join-btn" onClick={handleJoin}>
                Join Now →
              </button>
            </>
          ) : (
            <>
              <div className="join-success">
                ✅ Joined room: <strong>{roomId}</strong>
              </div>

              <button className="join-btn" onClick={handleReady}>
                I'm Ready 👍
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
