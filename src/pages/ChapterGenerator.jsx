import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChapterGenerator() {
  const [description, setDescription] = useState("");
  const [chapter, setChapter] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

const generateChapter = async () => {
  if (!description.trim()) return alert("Please enter a topic");

  setLoading(true);
  setChapter("");
  setSaved(false);

  try {
    const res = await axios.post(
      "http://localhost:5000/api/ai/chapter",
      { description },
      { withCredentials: true }
    );

    const chapterId = res.data.data._id; // ✅ get id
    window.location.href = `/chapter/${chapterId}`; // ✅ redirect
  } catch (err) {
    console.error(err);
    alert("❌ Error generating chapter");
  }

  setLoading(false);
};


  const copyText = () => {
    navigator.clipboard.writeText(chapter);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef3ff] to-[#f2f5ff]">
      <Navbar />

      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="text-center mb-8">
          <h1
            className="text-4xl font-bold text-white py-5 px-8 bg-gradient-to-r 
                         from-[#6a5af9] to-[#7f4eff] rounded-2xl shadow-xl inline-block"
          >
            📚 AI Chapter Generator
          </h1>
        </div>

        {/* Input Box */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border-l-4 border-purple-500">
          <label className="font-semibold text-gray-700 text-lg">
            ✍️ Enter chapter topic:
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-2 p-4 border rounded-xl focus:ring-2 focus:ring-purple-400"
            rows="4"
            placeholder="Example: Machine learning supervised vs unsupervised..."
          ></textarea>

          <button
            onClick={generateChapter}
            disabled={loading}
            className="mt-4 w-full md:w-auto px-8 py-3 rounded-xl text-white font-semibold
                       bg-gradient-to-r from-[#6a5af9] to-[#7f4eff] hover:opacity-90 shadow-lg"
          >
            {loading ? "⏳ Generating..." : "✨ Generate Chapter"}
          </button>

          {saved && (
            <p className="text-green-600 font-medium mt-2">
              ✅ Saved to your chapters
            </p>
          )}
        </div>

        {/* Output */}
        {chapter && (
          <div className="mt-10 bg-white p-8 rounded-2xl shadow-xl border-l-4 border-blue-500">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-purple-700">
                ✅ Generated Chapter
              </h2>
              <button
                onClick={copyText}
                className="text-sm bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                📋 Copy
              </button>
            </div>

            <div className="prose max-w-none text-gray-800 leading-7 overflow-y-auto max-h-[400px] pr-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {chapter}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      {/* Floating Encourage Btn */}
      <button
        className="fixed bottom-6 right-6 bg-gradient-to-r from-[#6a5af9] to-[#7f4eff] 
                   text-white px-6 py-3 rounded-full shadow-xl font-semibold hover:opacity-90"
      >
        💪 Stay Focused!
      </button>
    </div>
  );
}
