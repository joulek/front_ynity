import React, { useMemo, useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import "../pages/styles/PlanningResult.css";
import Navbar from "../components/Navbar";
import { FaPlay, FaStop, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

function PlanningResult() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { planning, title } = state || {};
  const [selectedRev, setSelectedRev] = useState(null);
  const [timerId, setTimerId] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const timerRef = useRef(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/user`, {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data));
  }, []);

  const subjectColorMap = useMemo(() => {
    const colors = [
      "#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa",
      "#f472b6", "#14b8a6", "#f97316", "#64748b"
    ];
    const map = {};
    let colorIndex = 0;

    planning?.forEach(day => {
      day.revisions?.forEach(rev => {
        const subject = rev.subjectLabel || "Unknown subject";
        if (!map[subject]) {
          map[subject] = colors[colorIndex % colors.length];
          colorIndex++;
        }
      });
    });

    return map;
  }, [planning]);

  const getColor = (subject) => subjectColorMap[subject] || "#9ca3af";

  if (!planning) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="empty-planning">
        <div>
          <h2>No planning found</h2>
          <p>Create your first schedule to start</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/planning")}
            className="btn-primary"
          >
            Generate a planning
          </motion.button>
        </div>
      </motion.div>
    );
  }

  const events = planning.flatMap((day) =>
    (day.revisions || []).map((rev) => {
      const color = getColor(rev.subjectLabel);
      return {
        title: `${rev.subjectLabel || "Unknown Subject"}: ${rev.title}`,
        start: `${day.date}T${rev.start || "08:00"}`,
        end: `${day.date}T${rev.end || "09:00"}`,
        backgroundColor: color,
        borderColor: color,
        textColor: "#ffffff",
        extendedProps: {
          subjectLabel: rev.subjectLabel,
          chapter: rev.title,
          start: rev.start,
          end: rev.end,
          courseTitle: rev.title,
          courseId: rev.courseId,
          summaryExists: rev.summaryExists,
          color,
          eventId: rev.eventId,
        },
      };
    })
  );

  const openModal = (info) => setSelectedRev(info.event);
  const closeModal = () => {
    setSelectedRev(null);
    clearInterval(timerId);
    setTimeLeft(null);
  };

  const post = (url, data = {}) => axios.post(url, data, { withCredentials: true });

  const handleStart = (e) => {
    const subject = e.extendedProps.subjectLabel || "subject";
    const heure = e.extendedProps.start || "00:00";
    const dateObj = e.start instanceof Date ? e.start : new Date();
    const dateStr = dateObj.toISOString().split("T")[0];

    const eventId =
      e.extendedProps.eventId ||
      `${user._id}_${subject}_${dateStr}_${heure}`.replace(/\s+/g, "_");

    post(`${import.meta.env.VITE_BACKEND_URL}/api/revision/start/${eventId}`, {
      title: e.title,
      courseTitle: e.extendedProps.courseTitle,
      courseId: e.extendedProps.courseId,
      date: dateStr,
    })
      .then(closeModal)
      .catch(() => alert("Start failed."));
  };

  const handleEnd = async () => {
    clearInterval(timerId);
    setTimeLeft(null);
    if (!selectedRev) return;

    const subject = selectedRev.extendedProps.subjectLabel || "subject";
    const heure = selectedRev.extendedProps.start || "00:00";
    const dateObj = selectedRev.start instanceof Date ? selectedRev.start : new Date();
    const dateStr = dateObj.toISOString().split("T")[0];

    const eventId =
      selectedRev.extendedProps.eventId ||
      `${user._id}_${subject}_${dateStr}_${heure}`.replace(/\s+/g, "_");

    try {
      await post(`${import.meta.env.VITE_BACKEND_URL}/api/revision/end/${eventId}`, {
        title: selectedRev.title,
        courseId: selectedRev.extendedProps.courseId,
        date: dateStr,
      });
      closeModal();
    } catch (err) {
      alert("Failed to end the session.");
      console.error(err);
    }
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60).toString().padStart(2, "0");
    const sec = (seconds % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  return (
    <div className="planning-result-page">
      <Navbar />
      <div className="page-header-plans">
        <h1 className="page-title-plans">{title || "My Planning"}</h1>
      </div>

      <div className="calendar-wrapper glass">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="auto"
          events={events}
          eventClick={openModal}
          eventContent={(eventInfo) => {
            const { subjectLabel, chapter, start, end, color } = eventInfo.event.extendedProps;
            return (
              <div className="event-content" style={{
                backgroundColor: color,
                borderRadius: "6px",
                padding: "0.4rem",
                color: "#fff",
                fontSize: "0.9rem"
              }}>
                <div style={{ fontWeight: "bold" }}>{subjectLabel}</div>
                <div>{chapter}</div>
                <div style={{ fontSize: "0.75em" }}>🕒 {start} → {end}</div>
              </div>
            );
          }}
        />
      </div>

      {selectedRev && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="modal-overlay">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="modal-content glass">
            <h3 style={{ textAlign: "center" }}>
              <span className="subject-badge-timer" style={{ backgroundColor: selectedRev.extendedProps.color }}>
                {selectedRev.extendedProps.subjectLabel} — {selectedRev.extendedProps.chapter}
              </span>
            </h3>
            <div className="time-display">
              <span>{selectedRev.extendedProps.start}</span>
              <div className="time-arrow">&rarr;</div>
              <span>{selectedRev.extendedProps.end}</span>
            </div>
            <div className="course-actions">
              <Link
                to={`/courses/by-title/${encodeURIComponent(selectedRev.extendedProps.courseTitle)}`}
                className="course-link"
              >
                📘 View Course
              </Link>
              {selectedRev.extendedProps.summaryExists && (
                <Link
                  to={`/courses/${encodeURIComponent(selectedRev.extendedProps.courseTitle)}/summary`}
                  className="summary-link"
                >
                  📜 View Summary
                </Link>
              )}
            </div>
            {timeLeft !== null && (
              <div className="timer-display">
                ⏱️ Remaining Time: {formatTime(timeLeft)}
              </div>
            )}
            <div className="modal-actions">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleStart(selectedRev)} className="btn-success">
                <FaPlay /> Start
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleEnd(selectedRev)} className="btn-danger">
                <FaStop /> End
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={closeModal} className="btn-secondary">
                <FaTimes /> Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default PlanningResult;
