import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FiDownload, FiAward } from "react-icons/fi";
import "../pages/styles/FullSummaryPage.css";
import Navbar from "../components/Navbar";
import html2pdf from "html2pdf.js";

export default function CourseFullSummary() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showMotivation, setShowMotivation] = useState(true);

  const contentRef = useRef(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/course/${id}/summary`, {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setCourse(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load the summary.");
        setLoading(false);
      });
  }, [id]);

  const exportPDF = () => {
    const element = contentRef.current;

    const opt = {
      filename: `${course.title}-summary.pdf`,
      image: { type: "jpeg", quality: 0.95 },
      html2canvas: {
        scale: 3,
        useCORS: true,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
      pagebreak: {
        mode: ["avoid-all", "css", "legacy"],
      },
    };

    html2pdf().set(opt).from(element).save();
  };

  if (loading) return <div className="p-8">Loading…</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="summary-container">
      <Navbar />

      <div className="summary-header">
        <h1 className="mysummary-title">
          📘 Summary: <strong>{course.title}</strong>
        </h1>
      </div>

      {/* ✅ نفس style متاع UI visible و PDF */}
      <div className="summary-content" id="pdf-wrapper" ref={contentRef}>
        <div className="summary-markdown">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {course.summaryText}
          </ReactMarkdown>
        </div>
      </div>

      <div className="action-buttons">
        <button onClick={exportPDF} className="action-btn primary-btn">
          <FiDownload /> Export PDF
        </button>
      </div>

      {showMotivation && (
        <div
          className="motivation-badge"
          onClick={() => setShowMotivation(false)}
        >
          <FiAward /> You can do it! 💪
        </div>
      )}
    </div>
  );
}
