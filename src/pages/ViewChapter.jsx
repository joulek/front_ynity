import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ViewChapter() {
  const { id } = useParams();
  const [chapter, setChapter] = useState(null);

  useEffect(() => {
    const fetchChapter = async () => {
      const res = await axios.get(`http://localhost:5000/api/ai/chapters`, {
        withCredentials: true
      });
      const found = res.data.find((c) => c._id === id);
      setChapter(found);
    };

    fetchChapter();
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef3ff] to-[#f2f5ff]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-12">
        {chapter && (
          <div className="bg-white p-8 rounded-2xl shadow-xl border-l-4 border-blue-500">
            <h2 className="text-2xl font-bold text-purple-700 mb-4">
              {chapter.description}
            </h2>

            <div className="prose text-gray-800 overflow-y-auto max-h-[600px]">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {chapter.chapterContent}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
