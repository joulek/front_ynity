import React, { useEffect, useState } from "react";
import { FiEdit2, FiFile, FiCheckCircle, FiX, FiSave } from "react-icons/fi";

function EditModal({
  isOpen,
  editCourse,
  newTitle,
  setNewTitle,
  newFile,
  setNewFile,
  onClose,
  onSave,
}) {
  const extractFileName = (path) => {
    if (!path) return "";
    return path.split("/").pop().split("\\").pop(); // ✅ handles both separators
  };

  const [fileName, setFileName] = useState(extractFileName(editCourse?.file));

  useEffect(() => {
    setFileName(extractFileName(editCourse?.file));
  }, [editCourse]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewFile(file);
      setFileName(file.name);
    }
  };

  if (!isOpen || !editCourse) return null;

  return (
    <div className="edit-modal active">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title" style={{ color: "white" }}>
            <FiEdit2 size={24} style={{ color: "white" }} /> Edit Course
          </h3>
        </div>

        <div className="modal-body">
          <div className="modal-input-group">
            <label className="modal-label">Course Name</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="modal-input"
              autoFocus
            />
          </div>

          <div className="modal-input-group">
            <label className="modal-label">Course File</label>
            <div className="file-input-container">
              <label className="file-input-label">
                <span className="file-input-text">
                  {fileName || "Choose a PDF file"}
                </span>
                <FiFile size={20} color="#6b7280" />
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="file-input"
                />
              </label>
            </div>

            {editCourse?.file && (
              <a
                href={`/${editCourse.file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="file-link"
              >
                {extractFileName(editCourse.file)}
              </a>
            )}
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onClose} className="modal-btn modal-btn-cancel">
            <FiX /> Cancel
          </button>
          <button
            onClick={onSave}
            className="modal-btn modal-btn-save"
            disabled={!newTitle}
          >
            <FiSave /> Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditModal;
