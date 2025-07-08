import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../pages/styles/MyPlannings.css";
import Navbar from "../components/Navbar";
import { Eye, Trash2 } from "lucide-react";
import { CalendarDays, Clock, BookOpen, ClipboardList } from "lucide-react";
import { motion } from "framer-motion";


function MyPlannings() {
  const [plannings, setPlannings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/planning/my`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("📥 Retrieved plannings:", data);
        setPlannings(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("❌ Fetch error:", err);
        setIsLoading(false);
      });
  }, []);

  const goToPlanning = (planning) => {
    if (!planning?.planning || planning.planning.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Empty Planning',
        text: 'This planning is empty or improperly structured!',
        confirmButtonColor: '#4f46e5',
      });
      return;
    }
    navigate("/planning/result", {
      state: { planning: planning.planning, planningId: planning._id },
    });
  };

  const handleDelete = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Confirm Deletion',
      text: "Are you sure you want to delete this planning? This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });

    if (!isConfirmed) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/planning/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Deletion error");

      setPlannings((prev) => prev.filter((p) => p._id !== id));

      await Swal.fire({
        title: 'Deleted!',
        text: 'Your planning has been successfully deleted.',
        icon: 'success',
        confirmButtonColor: '#4f46e5',
      });
    } catch (err) {
      console.error("Planning deletion error:", err);
      Swal.fire({
        title: 'Error',
        text: 'An error occurred while deleting the planning.',
        icon: 'error',
        confirmButtonColor: '#4f46e5',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <motion.div
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
          className="loading-circle"
        />
        <p className="loading-text">
          🧠 Our AI, powered by <span className="highlight-groq">Groq</span> and the <span className="highlight-llama">LLaMA&nbsp;3</span> model,<br/> is analyzing your revision data...
        </p>
      </div>
    );
  }

  return (
    <div className="my-plannings-container">
      <Navbar />
      <div className="page-header-plannings">
        <h1 className="page-title-plannings">My Schedules</h1>
      </div>

      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <div className="plan-button-container">
          <button
            onClick={() => navigate("/planning")}
            className="plan-button"
          >
            <CalendarDays size={18} />
            Generate my revision plan
          </button>
        </div>
      </div>

      {plannings.length === 0 ? (
        <div className="empty-state">
          <p>No plannings found.</p>
          <p>Start by creating your first planning!</p>
        </div>
      ) : (
        <div className="plannings-list">
          {plannings.map((p, index) => (
            <div key={p._id} className="planning-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="card-header">
                <h3 className="card-title">
                  <ClipboardList className="cards-icon" size={20} />
                  {p.title || "Untitled Planning"}
                </h3>
              </div>

              <div className="card-body">
                <div className="card-meta">
                  <span className="card-meta-item">
                    <CalendarDays className="meta-icon" size={16} />
                    {new Date(p.createdAt).toLocaleDateString("en-GB")}
                  </span>
                  <span className="card-meta-item">
                    <Clock className="meta-icon" size={16} />
                    {p.nbJours} days
                  </span>
                </div>

                {p.planning?.length > 0 && (
                  <div className="subjects-list">
                    <div className="subjects-label">
                      <BookOpen className="subject-icon" size={16} />
                      Studied Subjects
                    </div>
                    <div className="subjects-text">
                      {[...new Set(
                        p.planning.flatMap((day) =>
                          day.revisions.map((r) => r.subjectLabel || r.title)
                        )
                      )].join(", ")}
                    </div>
                  </div>
                )}
              </div>

              <div className="card-actions">
                <button onClick={() => goToPlanning(p)} className="btn btn-view">
                  <Eye size={18} /> View
                </button>
                <button onClick={() => handleDelete(p._id)} className="btn btn-delete">
                  <Trash2 size={18} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyPlannings;
