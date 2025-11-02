import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../pages/styles/AllSummaries.css";
import {
  FiBookOpen,
  FiTrash2,
  FiDownload,
  FiClock,
  FiPlus,
} from "react-icons/fi";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

export default function AllSummaries() {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/course/my-summaries`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setSummaries(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This summary will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/course/summary/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Delete failed");

      setSummaries((prev) => prev.filter((c) => c._id !== id));

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "The summary has been successfully deleted.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Error deleting:", err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong while deleting the summary.",
      });
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="loading-circle"
        />
        <p className="loading-text">
          🧠 Our AI is analyzing your revision data...
        </p>
      </div>
    );
  }

  return (
    <div className="mysummaries-container">
      <Navbar />

      <div className="page-header-resumes">
        <h1 className="page-title-resumes">My Summaries</h1>
      </div>

      {summaries.length === 0 ? (
        <div className="mysummaries-empty">
          <p>No summaries generated yet.</p>
          <button
            onClick={() => navigate("/courses")}
            className="mysummaries-action-btn mysummaries-primary-btn"
          >
            <FiPlus /> Create a summary
          </button>
        </div>
      ) : (
        <div className="mysummaries-grid">
          {summaries.map((c) => (
            <div key={c._id} className="mysummaries-card">
              <div className="mysummaries-header">
                <h2 className="mysummaries-title">{c.title}</h2>
                <p className="mysummaries-date">
                  <FiClock />{" "}
                  {new Date(c.updatedAt || c.createdAt).toLocaleString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div className="mysummaries-actions">
                <button
                  onClick={() => navigate(`/courses/${c._id}/full-summary`)}
                  className="mysummaries-action-btn mysummaries-open-btn"
                >
                  <FiBookOpen /> Open
                </button>

                <button
                  onClick={() => handleDelete(c._id)}
                  className="mysummaries-action-btn mysummaries-delete-btn"
                >
                  <FiTrash2 /> Delete
                </button>

                {c.summaryPdf && (
                  <a
                    href={`${import.meta.env.VITE_BACKEND_URL}/${c.summaryPdf}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mysummaries-action-btn mysummaries-download-btn"
                  >
                    <FiDownload /> PDF
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
