import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FiArrowLeft, FiBookmark, FiPrinter, FiDownload, FiAward } from "react-icons/fi";
import "../pages/styles/FullSummaryPage.css";
import Navbar from "../components/Navbar";

export default function CourseFullSummary() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showMotivation, setShowMotivation] = useState(true);

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

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    alert("Summary saved to your favorites!");
  };

  const handleDownload = () => {
    alert("Downloading summary as PDF!");
  };

  if (loading) return <div className="p-8">Loading…</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="summary-container">
      <Navbar />
      <div className="summary-header">
        <h1 className="mysummary-title">Summary: <strong>{course.title}</strong></h1>
      </div>

      <div className="summary-content">
        <div className="summary-markdown">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ node, ...props }) => <h2 {...props} />,
              h3: ({ node, ...props }) => <h3 {...props} />,
              strong: ({ node, ...props }) => <strong {...props} />,
              li: ({ node, ...props }) => <li {...props} />,
              p: ({ node, ...props }) => <p {...props} />,
              blockquote: ({ node, ...props }) => <blockquote {...props} />,
            }}
          >
            {course.summaryText}
          </ReactMarkdown>
        </div>

        <div className="action-buttons">
          <button onClick={handlePrint} className="action-btn secondary-btn">
            <FiPrinter /> Print
          </button>
        </div>
      </div>

      {showMotivation && (
        <div className="motivation-badge" onClick={() => setShowMotivation(false)}>
          <FiAward /> You can do it! 💪
        </div>
      )}
    </div>
  );
}
