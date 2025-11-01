import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

export default function SubjectPlanning() {
  const { subjectId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.planning || !subjectId) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="subject-planning-error"
      >
        <Navbar />
        <div className="error-message">
          <h2>Données non disponibles</h2>
          <p>Impossible de charger les détails de la matière.</p>
          <button 
            onClick={() => navigate("/planning")} 
            className="btn-primary"
          >
            Retour au planning
          </button>
        </div>
      </motion.div>
    );
  }

  const { planning, title, subjectLabel } = state;

  // 1. Filtrer les événements pour la matière sélectionnée
  const subjectEvents = [];
  const chapters = new Set(); // Pour lister les chapitres uniques

  planning.forEach((day) => {
    (day.revisions || []).forEach((rev) => {
      if (rev.subjectId === subjectId || rev.courseId === subjectId) {
        const event = {
          title: rev.title || "Révision",
          start: `${day.date}T${rev.start || "08:00"}`,
          end: `${day.date}T${rev.end || "09:00"}`,
          color: "#3b82f6",
          extendedProps: {
            chapter: rev.title,
            duration: rev.duration,
          },
        };
        subjectEvents.push(event);
        chapters.add(rev.title);
      }
    });
  });

  // 2. Créer la liste des chapitres
  const chaptersList = Array.from(chapters);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="subject-planning-page"
    >
      <Navbar />
      
      <div className="subject-header">
        <h1>
          {subjectLabel || "Détails de la matière"}
          <span className="planning-title">{title && ` | ${title}`}</span>
        </h1>
        
        {chaptersList.length > 0 && (
          <div className="chapters-list">
            <h3>Chapitres inclus :</h3>
            <ul>
              {chaptersList.map((chapter, index) => (
                <li key={index}>{chapter}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="calendar-wrapper glass">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="auto"
          events={subjectEvents}
          eventContent={(eventInfo) => (
            <div className="event-content">
              <b>{eventInfo.event.title}</b>
              {eventInfo.event.extendedProps.duration && (
                <p>{eventInfo.event.extendedProps.duration}</p>
              )}
            </div>
          )}
        />
      </div>
    </motion.div>
  );
}