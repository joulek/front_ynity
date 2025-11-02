import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// ✅ import CSS file
import "./styles/ViewChapter.css";

export default function ViewChapter() {
  const { id } = useParams();
  const [chapter, setChapter] = useState(null);

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/ai/chapters", {
          withCredentials: true,
        });

        const found = res.data.find((c) => c._id === id);
        setChapter(found);
      } catch (e) {
        console.error("Error fetching chapter:", e);
      }
    };

    fetchChapter();
  }, [id]);

  return (
    <div className="chapter-page">
      <Navbar />

      <div className="chapter-container">
        
        {/* ✅ Gradient Title */}
        <h1 className="chapter-title-banner">
          Chapter: {chapter?.description}
        </h1>

        {/* ✅ Styled Chapter Content */}
        {chapter && (
          <div className="chapter-box">
            <div className="chapter-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({node, ...props}) => <h2 {...props} />,
                  h2: ({node, ...props}) => <h3 {...props} />,
                  h3: ({node, ...props}) => <h4 {...props} />,
                  li: ({node, ...props}) => <li {...props} />,
                  strong: ({node, ...props}) => <strong {...props} />,
                }}
              >
                {chapter?.chapterContent}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* ✅ If chapter not found */}
        {!chapter && (
          <p style={{ textAlign: "center", marginTop: "20px", color: "#777" }}>
            loading...
          </p>
        )}

      </div>
    </div>
  );
}
