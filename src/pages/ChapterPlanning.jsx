import React from "react";
import { useLocation } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import Navbar from "../components/Navbar";

export default function ChapterPlanning() {
  const { state } = useLocation();
  const { 
    planning, 
    subjectId, 
    subjectLabel, 
    chapterId, 
    chapterTitle 
  } = state || {};

  if (!chapterId || !planning) {
    return <div>❌ Données manquantes</div>;
  }

  const filteredEvents = planning.flatMap((day) => 
    (day.revisions || [])
      .filter(rev => rev.chapterId === chapterId)
      .map(rev => ({
        title: rev.title,
        start: `${day.date}T${rev.start}`,
        end: `${day.date}T${rev.end}`,
        color: "#10b981",
      }))
  );

  return (
    <div className="chapter-planning-container">
      <Navbar />
      <h2 className="chapter-title">
        {subjectLabel} - {chapterTitle}
      </h2>
      
      <div className="chapter-details glass">
        <p>Nombre de sessions: {filteredEvents.length}</p>
      </div>

      <div className="calendar-wrapper glass">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          height="auto"
          events={filteredEvents}
        />
      </div>
    </div>
  );
}