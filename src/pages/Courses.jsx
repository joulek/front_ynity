import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../pages/styles/Courses.css";
import { FaMagic } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";
import { FiEdit2, FiTrash2, FiFile, FiCalendar, FiCheck } from "react-icons/fi";
import EditModal from "../components/EditModal";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";






function Courses() {
  const [courses, setCourses] = useState([]);
  const [editCourse, setEditCourse] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newFile, setNewFile] = useState(null);
  const [loadingCourseId, setLoadingCourseId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showExamModal, setShowExamModal] = useState(false);
  const [examType, setExamType] = useState("QCM");
  const [questionCount, setQuestionCount] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [modes, setModes] = useState({});
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false); // Nouvelle état pour la popup de résumé
  const [selectedCourseId, setSelectedCourseId] = useState(null); // ID du cours sélectionné pour la popup
  const [showGroqLoader, setShowGroqLoader] = useState(false);


  const navigate = useNavigate();
  const { id: subjectId } = useParams();

  const fetchCourses = async () => {
    try {
      const url = subjectId
        ? `/api/course/by-subject/${subjectId}`
        : "/api/course/my";

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}${url}`, {
        credentials: "include",
      });
      const data = await res.json();
      setCourses(data);
      setIsLoading(false);
    } catch (err) {
      console.error("Erreur récupération cours :", err);
      setIsLoading(false);
    }
  };

  const handleEdit = (course) => {
    setEditCourse(course);
    setNewTitle(course.title);
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!newTitle) return;

    const formData = new FormData();
    formData.append("title", newTitle);
    if (newFile) formData.append("file", newFile);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/course/update/${editCourse._id}`,
        { method: "PUT", credentials: "include", body: formData }
      );

      if (!res.ok) throw new Error();

      await fetchCourses();
      setIsModalOpen(false);
      setEditCourse(null);
    } catch (err) {
      Swal.fire("Error", "Error while updating", "error");
    }
  };

  const handleDelete = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: "Delete this course ?",
      text: "This action is irreversible..",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    });

    if (isConfirmed) {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/course/delete/${id}`,
          { method: "DELETE", credentials: "include" }
        );

        if (!res.ok) throw new Error();

        await fetchCourses();
        Swal.fire("Success", "Course deleted", "success");
      } catch {
        Swal.fire("Error", "Error while deleting", "error");
      }
    }
  };
  const handleGenerateFlashcards = async (id) => {
    setLoadingCourseId(id);
    setShowGroqLoader(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/flashcards/generate/${id}`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      const result = await res.json();
      Swal.fire("Success", `${result.length} flashcards generated`, "success");
    } catch {
      Swal.fire("Error", "Error while generating", "error");
    } finally {
      setLoadingCourseId(null);
      setShowGroqLoader(false);
    }
  };


  const toggleSelect = (course) => {
    setSelectedCourses(prev =>
      prev.some(c => c._id === course._id)
        ? prev.filter(c => c._id !== course._id)
        : [...prev, course]
    );
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedCourses(selectAll ? [] : [...courses]);
  };


  const handleGenerateExam = async () => {
    if (selectedCourses.length === 0) {
      Swal.fire("Error", "You have to select at least one course", "error");
      return;
    }
    setShowGroqLoader(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/exam/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          courseIds: selectedCourses.map(c => c._id),
          type: examType,
          questionCount
        }),
      });
      if (!res.ok) throw new Error("Error generating");
      const exam = await res.json();
      Swal.fire({
        icon: "success",
        title: selectedCourses.length > 1 ? "Combined Exam Generated!" : "Exam Generated!",
        text: `Exam of type ${examType} generated successfully.`,
        confirmButtonText: "View Exam",
      }).then(() => navigate(`/exam/${exam._id}`));
    } catch (err) {
      Swal.fire("Error", err.message || "Failed to generate the exam.", "error");
    } finally {
      setShowGroqLoader(false);
    }
  };

  const generateSummary = async (courseId) => {
    if (!courseId) return Swal.fire("Error", "Invalid course", "error");
    setShowGroqLoader(true);
    try {
      const selectedMode = modes[courseId] || "long";
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/course/summarize/${courseId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ mode: selectedMode }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      navigate(`/courses/${data.courseId}/full-summary`);
    } catch {
      Swal.fire("Error", "Failed to generate summary", "error");
    } finally {
      setShowGroqLoader(false);
    }
  };

  const getDisplayFileName = (path) => {
    if (!path) return "";
    const raw = path.split(/[/\\]/).pop();
    return raw.replace(/^\d+[-_]?/, "");
  };

  const fixMisencoded = (s) => {
    try {
      return decodeURIComponent(escape(s));
    } catch {
      return s;
    }
  };

  const getIconForFile = (file) => {
    if (file.endsWith(".pdf")) return "📄 PDF";
    if (file.endsWith(".docx")) return "📝 Word";
    if (file.endsWith(".pptx")) return "📊 PPT";
    if (file.endsWith(".txt")) return "📃 Texte";
    return "📁";
  };

  useEffect(() => {
    fetchCourses();
  }, [subjectId]);

  if (isLoading) {
    return (
      <div className="courses-container">
        <Navbar />
        <div className="loading-cercle">
          <p>Loading courses...</p>
        </div>
      </div>
    );
  }



  return (
    <div className="courses-container">
      <Navbar />
      {showGroqLoader && (
        <div className="groq-loading-overlay">
          <div className="groq-loading-content">
            <span className="groq-spinner" />
            <p>⏳ Groq API is generating, please wait...</p>
          </div>
        </div>
      )}

      {showExamModal && (
        <div className="exam-modal-overlay">
          <div className="exam-modal">
            <div className="exam-modal-header ">
              <h2 className="text-xl font-bold text-center">Generate exam</h2>
              <button
                className="exam-modal-close"
                onClick={() => setShowExamModal(false)}
              >
                &times;
              </button>
            </div>

            <div className="exam-modal-body">
              <div className="exam-form-group">
                <label>Exam Type :</label>
                <select
                  className="exam-form-select"
                  value={examType}
                  onChange={(e) => setExamType(e.target.value)}
                >
                  <option value="QCM">MCQ</option>
                  <option value="Cours">Course Questions</option>
                  <option value="Mixte">Mixed</option>
                </select>
              </div>

              <div className="exam-form-group">
                <label>Number of questions :</label>
                <input
                  type="number"
                  min="1"
                  className="exam-form-input"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                />
              </div>

              <div className="course-selection-section">
                <label className="select-all-label">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                  />
                  <span>Select all courses</span>
                </label>

                <div className="course-selection-list">
                  {courses.map(course => (
                    <div key={course._id} className="course-selection-item">
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedCourses.some(c => c._id === course._id)}
                          onChange={() => toggleSelect(course)}
                        />
                        <span className="course-selection-title">
                          {course.title}
                        </span>
                        <span className="course-selection-date">
                          {new Date(course.createdAt).toLocaleDateString()}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="exam-modal-footer">
              <button
                onClick={() => setShowExamModal(false)}
                className="exam-modal-cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateExam}
                className="exam-modal-confirm"
                disabled={selectedCourses.length === 0}
              >
                <FiCheck /> Generate Exam
              </button>
            </div>
          </div>
        </div>
      )}

      <EditModal
        isOpen={isModalOpen}
        editCourse={editCourse}
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        newFile={newFile}
        setNewFile={setNewFile}
        onClose={() => {
          setIsModalOpen(false);
          setEditCourse(null);
        }}
        onSave={handleUpdate}
      />
      {showSummaryModal && (
        <div className="exam-modal-overlay">
          <div className="exam-modal">
            <div className="exam-modal-header">
              <h2 className="text-xl font-bold text-center">Generate Summary</h2>
              <button
                className="exam-modal-close"
                onClick={() => setShowSummaryModal(false)}
              >
                &times;
              </button>
            </div>

            <div className="exam-modal-body">
              <div className="exam-form-group">
                <label>Summary Type :</label>
                <select
                  className="exam-form-select"
                  value={modes[selectedCourseId] || "long"}
                  onChange={(e) =>
                    setModes((prev) => ({
                      ...prev,
                      [selectedCourseId]: e.target.value,
                    }))
                  }
                >
                  <option value="short">Short Summary</option>
                  <option value="long">Long Summary</option>
                </select>
              </div>
            </div>

            <div className="exam-modal-footer">
              <button
                onClick={() => setShowSummaryModal(false)}
                className="exam-modal-cancel"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  generateSummary(selectedCourseId);
                  setShowSummaryModal(false);
                }}
                className="exam-modal-confirm"
              >
                Generate Summary
              </button>
            </div>
          </div>
        </div>
      )}


      <div className="courses-header">
        <h1 className="mycourses-title">My Courses</h1>
      </div>

      <div className="generate-exam-container">
        <motion.button
          className="generate-exam-btn"
          onClick={() => setShowExamModal(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Generate Exam
        </motion.button>
      </div>

      {courses.length === 0 ? (
        <p className="empty-state">No Courses found.</p>
      ) : (
        <div className="courses-grid">
          {courses.map((course) => (
            <div key={course._id} className="course-card">
              <div className="course-card-header">
                <div className="course-title">
                  <Link
                    to={`/courses/by-title/${encodeURIComponent(course.title)}`}
                    className="course-title-link"
                  >
                    {course.title}
                  </Link>
                </div>
              </div>
              <div className="course-card-body">
                <a
                  href={`${import.meta.env.VITE_BACKEND_URL}/${course.file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="course-file-link"
                >
                  <FiFile className="course-file-icon" />
                  {fixMisencoded(getDisplayFileName(course.file))}
                </a>
                <p className="course-date">
                  <FiCalendar className="course-date-icon" />
                  {new Date(course.createdAt).toLocaleDateString()}
                </p>

                <div className="course-actions">
                  <button
                    onClick={() => handleEdit(course)}
                    className="action-btn edit-btn"
                  >
                    <FiEdit2 /> Update
                  </button>
                  <button
                    onClick={() => handleDelete(course._id)}
                    className="action-btn delete-btn"
                  >
                    <FiTrash2 /> Delete
                  </button>
                  <button
                    onClick={() => handleGenerateFlashcards(course._id)}
                    className={`action-btn generate ${loadingCourseId === course._id ? "loading" : ""}`}
                    disabled={loadingCourseId === course._id}
                  >
                    {loadingCourseId === course._id ? (
                      <>
                        <div className="spinner"></div>
                        Génération…
                      </>
                    ) : (
                      <>
                        <FaMagic /> Generate Flashcards
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCourseId(course._id);
                      setShowSummaryModal(true);
                    }}
                    className="action-btn summary-btn"
                  >
                    Generate Summary
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Courses;