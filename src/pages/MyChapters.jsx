import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";  // ✅ Added
import "./styles/MyChapters.css";

export default function MyChapters() {
  const [chapters, setChapters] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("https://backend-ynity-1.onrender.com/api/ai/chapters", {
          withCredentials: true,
        });
        setChapters(res.data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // ✅ SWEETALERT DELETE
  const deleteChapter = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete this chapter?",
      text: "This action is irreversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
    });

    if (!confirm.isConfirmed) return;

    setLoading(true);
    try {
      await axios.delete(`https://backend-ynity-1.onrender.com/api/ai/chapter/${id}`, {
        withCredentials: true,
      });

      setChapters(chapters.filter((c) => c._id !== id));

      Swal.fire("Deleted!", "The chapter has been deleted.", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to delete chapter", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const generateChapter = async () => {
    if (!description.trim()) return Swal.fire("Oops!", "Please enter a chapter topic", "warning");
    setLoading(true);
    try {
      const res = await axios.post(
        "https://backend-ynity-1.onrender.com/api/ai/chapter",
        { description },
        { withCredentials: true }
      );
      const chapterId = res.data.data._id;
      setShowModal(false);
      setDescription("");
      window.location.href = `/chapter/${chapterId}`;
    } catch (e) {
      console.error(e);
      Swal.fire("Error", "Failed to generate chapter", "error");
    }
    setLoading(false);
  };

  return (
    <div className="mychapters-page">
      <Navbar />

      <div className="container">
        <h1 className="title-banner">My AI Chapters</h1>

        <div className="actions">
          <button className="btn-grad" onClick={() => setShowModal(true)}>
            ✨ Generate New Chapter
          </button>
        </div>

        <div className="grid">
          {chapters.map((c) => (
            <div key={c._id} className="chapter-card">
              <div className="chapter-title">{c.description}</div>
              <div className="chapter-date">
                {new Date(c.createdAt).toLocaleDateString()}
              </div>

              <div className="card-actions">
                <Link to={`/chapter/${c._id}`} className="card-action view-btn">
                  👁️ View
                </Link>

                <button
                  className="card-action delete-btn"
                  onClick={() => deleteChapter(c._id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}

          {chapters.length === 0 && (
            <div className="empty">
              😌 No chapters generated yet
              <br />
              <button className="cta" onClick={() => setShowModal(true)}>
                Generate your first chapter
              </button>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>✍️ Create New Chapter</h2>
            <textarea
              placeholder="Enter your chapter description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="btns">
              <button
                className="btn-grad cancel"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn-grad"
                disabled={loading}
                onClick={generateChapter}
              >
                {loading ? "⏳ Generating..." : "✨ Generate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
