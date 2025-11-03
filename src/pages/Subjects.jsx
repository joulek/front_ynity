import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiBook, FiEdit2, FiTrash2, FiX, FiSearch } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import "../pages/styles/subjects.css";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";
import CreateCourse from "./CreateCourse";



function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [newLabel, setNewLabel] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/subject`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setSubjects(data);
        setFilteredSubjects(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    setFilteredSubjects(
      subjects.filter((s) =>
        s.label.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, subjects]);

  const handleAddOrUpdate = async () => {
    if (!newLabel.trim()) return;
    setIsLoading(true);

    try {
      if (editingSubject) {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/subject/${editingSubject._id}`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ label: newLabel }),
        });
        const updated = await res.json();
        const updatedList = subjects.map((s) => (s._id === updated._id ? updated : s));
        setSubjects(updatedList);
        setFilteredSubjects(updatedList);
      } else {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/subject`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ label: newLabel }),
        });
        const data = await res.json();
        const updatedList = [...subjects, data];
        setSubjects(updatedList);
        setFilteredSubjects(updatedList);
      }

      setNewLabel("");
      setEditingSubject(null);
      setShowModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete this subject?",
      text: "This action is irreversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
    });

    if (!confirm.isConfirmed) return;

    setIsLoading(true);
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/subject/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const updated = subjects.filter((s) => s._id !== id);
      setSubjects(updated);
      setFilteredSubjects(updated);

      Swal.fire("Deleted!", "The subject has been deleted.", "success");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenUpdateModal = (subject) => {
    setEditingSubject(subject);
    setNewLabel(subject.label);
    setShowModal(true);
  };

  const handleOpenAddModal = () => {
    setEditingSubject(null);
    setNewLabel("");
    setShowModal(true);
  };


  return (
    <div className="subjects-container">
      <Navbar />

      <div className="page-header-subject">
        <h1 className="page-title-subject">My Subjects</h1>
      </div>

      <div className="search-add-container">
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search for a subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <motion.button
          className="add-button"
          onClick={handleOpenAddModal}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiPlus /> New Subject
        </motion.button>
      </div>

      {filteredSubjects.length === 0 ? (
        <motion.div
          className="empty-state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="empty-illustration">
            <FiBook size={48} />
          </div>
          <h3>No subjects found</h3>
          <p>Start by creating your first subject</p>
          <button onClick={handleOpenAddModal} className="cta-button" title="Add a new subject">
            <FiPlus /> Add Subject
          </button>
        </motion.div>
      ) : (
        <div className="subjects-grid">
          {filteredSubjects.map((subject) => (
            <motion.div
              key={subject._id}
              className="subject-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="subject-header">
                <div
                  className="subject-color"
                  style={{
                    backgroundColor: `hsl(${subject._id.charCodeAt(0) * 10 % 360}, 80%, 80%)`,
                  }}
                ></div>
                <h3>{subject.label}</h3>
              </div>

              <div className="subject-details">
                <span className="subject-date">
                  Created on {new Date(subject.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="subject-actions">
                <button
                  className="action-btn-subject primary"
                  onClick={() => {
                    setSelectedSubjectId(subject._id);
                    setShowCourseModal(true);
                  }}
                  title="Add courses to this subject"
                >
                  <FiPlus /> Course
                </button>

                <button
                  className="action-btn-subject secondary"
                  onClick={() => navigate(`/subjects/${subject._id}/courses`)}
                  title="View courses in this subject"
                >
                  <FiBook /> View
                </button>
              </div>

              <div className="subject-admin">
                <button
                  className="edit-btn-subject"
                  onClick={() => handleOpenUpdateModal(subject)}
                  title="Edit this subject"
                >
                  <FiEdit2 />
                </button>
                <button
                  className="delete-btn-subject"
                  onClick={() => handleDelete(subject._id)}
                  title="Delete this subject"
                >
                  <FiTrash2 />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <FiX />
              </button>

              <h2>{editingSubject ? "Edit Subject" : "New Subject"}</h2>

              <div className="input-group">
                <label>Subject Name</label>
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g., Mathematics"
                  autoFocus
                />
              </div>

              <button
                className="submit-btn-subject"
                onClick={handleAddOrUpdate}
                disabled={!newLabel.trim()}
              >
                {editingSubject ? "Update" : "Create"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCourseModal && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCourseModal(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxHeight: "90vh", overflowY: "auto" }}
            >
              <button className="modal-close" onClick={() => setShowCourseModal(false)}>
                <FiX />
              </button>

              <CreateCourse subjectId={selectedSubjectId} onClose={() => setShowCourseModal(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Subjects;
