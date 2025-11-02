import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FiArrowLeft, FiBookmark, FiPrinter, FiDownload } from "react-icons/fi";
import "../pages/styles/FullSummaryPage.css";

export default function CourseFullSummary() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        setError("Impossible de charger le résumé.");
        setLoading(false);
      });
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // Implémentez la logique de téléchargement PDF ici
    alert("Fonctionnalité de téléchargement PDF à implémenter");
  };

  if (loading) return <div className="p-8">Loading…</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="summary-container">
      <button
        onClick={() => navigate(-1)}
        className="summary-back-btn"
      >
        <FiArrowLeft /> Retour à mes résumés
      </button>

      <div className="summary-header">
        <h1 className="summary-title">Résumé du cours</h1>
        <p className="summary-subtitle">{course.title}</p>
      </div>

      <div className="summary-content">
        <div className="summary-markdown">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ node, ...props }) => (
                <h2 {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 {...props} />
              ),
              strong: ({ ...props }) => (
                <strong {...props} />
              ),
              li: ({ ...props }) => (
                <li {...props} />
              ),
              p: ({ ...props }) => (
                <p {...props} />
              ),
              blockquote: ({ ...props }) => (
                <blockquote {...props} />
              ),
              code: ({ ...props }) => (
                <code {...props} />
              ),
              pre: ({ ...props }) => (
                <pre {...props} />
              ),
            }}
          >
            {course.summaryText}
          </ReactMarkdown>
        </div>

        <div className="summary-actions">
          <button className="action-btn primary-action">
            <FiBookmark /> Sauvegarder
          </button>
          <button 
            onClick={handlePrint}
            className="action-btn secondary-action"
          >
            <FiPrinter /> Imprimer
          </button>
          <button 
            onClick={handleDownloadPDF}
            className="action-btn secondary-action"
          >
            <FiDownload /> PDF
          </button>
        </div>
      </div>
    </div>
  );
}