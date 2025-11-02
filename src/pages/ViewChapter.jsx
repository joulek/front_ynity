import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import html2pdf from "html2pdf.js";

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
  const exportPDF = () => {
    const element = document.getElementById("chapter-content");
    element.style.padding = "10mm 12mm";
    element.style.background = "white";
    element.style.width = "180mm"; // avoid overflow
    element.style.margin = "auto"; // center
    element.style.fontSize = "14px";

    const opt = {
      margin: [4, 0, 4, 0], // top, right, bottom, left in mm
      filename: `${chapter.description}.pdf`,
      image: { type: "jpeg", quality: 0.95 },
      html2canvas: {
        scale: 3,
        useCORS: true,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
      pagebreak: {
        mode: ["avoid-all", "css", "legacy"],
      },
    };

   html2pdf().set(opt).from(element).save();

  };

  return (
    <div className="chapter-page">
      <Navbar />

      <div className="chapter-container">
        {/* ✅ Gradient Title */}
        <h1 className="chapter-title-banner">
          Chapter: {chapter?.description}
        </h1>
        <div className="chapter-actions">
          <button className="btn-export" onClick={exportPDF}>
            📄 Export PDF
          </button>
        </div>

        {/* ✅ Styled Chapter Content */}
        {chapter && (
          <div className="chapter-box">
            <div id="chapter-content" className="chapter-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ node, ...props }) => <h2 {...props} />,
                  h2: ({ node, ...props }) => <h3 {...props} />,
                  h3: ({ node, ...props }) => <h4 {...props} />,
                  li: ({ node, ...props }) => <li {...props} />,
                  strong: ({ node, ...props }) => <strong {...props} />,
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
