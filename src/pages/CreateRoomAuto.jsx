import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import socket from "./socket";
import { UserContext } from "../context/UserContext";
import Navbar from "../components/Navbar";
import "../pages/styles/CreateRoomAuto.css";

export default function CreateRoomAuto() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const selectedCourseId = state?.selectedCourseId;
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const handleCreate = () => {
    if (!user?.name || !selectedCourseId) {
      console.warn("Missing player name or courseId");
      return;
    }

    setLoading(true);

    socket.emit("createRoom", { playerName: user.name }, (roomId) => {
      navigate(`/lobby/${roomId}`, {
        state: { playerName: user.name, courseId: selectedCourseId },
      });
    });
  };

  return (
    <div className="create-room-auto-container">
      <Navbar />

      {/* Decorative elements */}
      <div className="decoration-element decor-1"></div>
      <div className="decoration-element decor-2"></div>
      <div className="decoration-element decor-3"></div>

      <div className="create-room-content">
        <div className="creation-card">
          <h2 className="creation-title">
            <span className="icon">🚀</span> Create a Room
          </h2>

          <p className="creation-description">
            Ready to start your revision session? Instantly create a quiz room with your flashcards.
          </p>

          <button
            onClick={handleCreate}
            disabled={loading || !selectedCourseId}
            className="create-button"
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <span className="btn-icon">⚡</span>
                <span className="btn-text">AUTO-CREATE</span>
                <span className="btn-hover-effect"></span>
              </>
            )}
          </button>

          {!selectedCourseId && (
            <p className="warning-message">
              Please select a course first
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
