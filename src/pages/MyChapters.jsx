import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function MyChapters() {
  const [chapters, setChapters] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch chapters
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/ai/chapters", {
          withCredentials: true
        });
        setChapters(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchChapters();
  }, []);

  // ✅ Generate New Chapter
  const generateChapter = async () => {
    if (!description.trim()) {
      alert("Please enter a chapter topic");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/ai/chapter",
        { description },
        { withCredentials: true }
      );

      const chapterId = res.data.data._id;
      setShowModal(false);
      setDescription("");

      // redirect to view page
      window.location.href = `/chapter/${chapterId}`;
    } catch (err) {
      console.error(err);
      alert("❌ Error generating chapter");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef3ff] to-[#f2f5ff]">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* ✅ Header with button */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white py-4 px-6 bg-gradient-to-r 
                        from-[#6a5af9] to-[#7f4eff] rounded-2xl shadow-xl">
            📚 My AI Chapters
          </h1>

          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-[#6a5af9] to-[#7f4eff] text-white 
                       px-5 py-3 rounded-xl shadow-lg hover:opacity-90 transition"
          >
            ✨ Generate New Chapter
          </button>
        </div>

        {/* ✅ Chapters Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.map((c) => (
            <div
              key={c._id}
              className="bg-white p-5 shadow-lg rounded-2xl border-l-4 border-purple-500 hover:shadow-2xl transition"
            >
              <h2 className="font-bold text-gray-800 text-lg truncate">{c.description}</h2>

              <p className="text-sm text-gray-500 mt-1">
                {new Date(c.createdAt).toLocaleDateString()}
              </p>

              <Link
                to={`/chapter/${c._id}`}
                className="inline-block mt-4 px-4 py-2 bg-gradient-to-r from-[#6a5af9] 
                           to-[#7f4eff] text-white rounded-xl shadow hover:opacity-90 transition"
              >
                👁️ View
              </Link>
            </div>
          ))}

          {chapters.length === 0 && (
            <p className="text-center text-gray-600 col-span-3">
              😌 Aucune chapitre généré pour l’instant  
              <Link className="text-purple-600 underline" to="/ai/chapter">
                Générer un chapitre
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* ✅ Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-[90%] max-w-[450px]">

            <h2 className="text-xl font-bold text-purple-700 mb-4">
              ✍️ Create New Chapter
            </h2>

            <textarea
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400"
              rows="4"
              placeholder="Enter your chapter description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-200"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button
                onClick={generateChapter}
                disabled={loading}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#6a5af9] 
                           to-[#7f4eff] text-white shadow hover:opacity-90"
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
