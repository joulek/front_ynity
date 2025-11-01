import React, { useState, useRef } from "react";
import { FiUpload, FiCheck, FiX, FiSave } from "react-icons/fi";
import "../pages/styles/CreateCourse.css";

function CreateCourse({ subjectId, onClose }) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef();

  const handleUpload = async () => {
    if (!title || !file) {
      setMessage("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subjectId", subjectId);
    formData.append("file", file);

    setIsSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/course/create`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      setMessage("✅ Course added successfully!");
      setTitle("");
      setFile(null);
      setFileName("");
      onClose();
    } catch (err) {
      setMessage("❌ Error uploading course.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setFileName(selected.name);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setFileName(droppedFile.name);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-create-course">
        <button className="close-btn" onClick={onClose}>
          <FiX />
        </button>
        <h2 className="modal-title">Add New Course</h2>

        <div className="modal-body">
          <div className="form-group">
            <label>Course Title</label>
            <input
              type="text"
              placeholder="e.g. React Basics"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div
            className={`upload-area ${isDragging ? "dragging" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <FiUpload className="upload-icon" />
            <p>Drop file here or <span className="browse-text">browse</span></p>
            <input
              type="file"
              accept=".pdf,.docx,.pptx,.txt"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="file-input"
            />
            {fileName && (
              <div className="selected-file">
                <FiCheck /> {fileName}
              </div>
            )}
          </div>

          <button
            className="submit-btn"
            onClick={handleUpload}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="spinner"></div> Uploading...
              </>
            ) : (
              <>
                <FiSave className="button-icon" /> Add Course
              </>
            )}
          </button>

          {message && (
            <div className={`message-box ${message.includes("success") ? "success" : "error"}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateCourse;
