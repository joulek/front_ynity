import React from "react";
import Navbar from "../components/Navbar";
import "../pages/styles/Apis.css";

const apiData = [
  {
    name: "Groq (LLaMA 3)",
    description: "Used to generate summaries, flashcards, exams, and planning schedules through natural language prompts.",
    usage: [
      "SummarizeIA → summarize courses",
      "generateFlashcardsFromText → generate AI flashcards",
      "groqPlanning → create smart revision planning",
      "examAI → generate exam questions"
    ],
    icon: "🧠",
    color: "#6a11cb"
  },
  {
    name: "ElevenLabs TTS",
    description: "Text-to-speech generation for chatbot and motivational voice messages.",
    usage: [
      "ttsElevenLabs → transform chatbot/coaching messages into voice"
    ],
    icon: "🔊",
    color: "#2575fc"
  },
  {
    name: "Whisper (OpenAI)",
    description: "Used to transcribe voice messages into text for chatbot conversations.",
    usage: [
      "voice input → converts voice to text before sending to chatbot"
    ],
    icon: "🧾",
    color: "#10b981"
  },
  {
    name: "DALL·E 3 (OpenAI)",
    description: "Used to generate images for summaries, flashcards, and chat responses.",
    usage: [
      "imageGenerator → create visuals for chatbot and summaries"
    ],
    icon: "🎨",
    color: "#f59e0b"
  },
  {
    name: "File Parsing Tools",
    description: "Tools used to extract course content from uploaded documents.",
    usage: [
      "pdfUtils → parse PDF files",
      "docxUtils → extract text from DOCX",
      "pptxToText → extract slides from PPTX",
      "textExtractor → universal parser for all formats"
    ],
    icon: "📂",
    color: "#6366f1"
  }
  ,
 {
  name: "Tavily Search (Context Enrichment)",
  description: "Enhances AI-generated content with real-time and relevant web information for better quality and accuracy.",
  usage: [
    "SummarizeIA → improves course summaries with enriched context",
    "generateFlashcardsFromText → boosts accuracy of generated flashcards",
    "examAI → creates more realistic and varied exam questions",
    "chatbotAgent → enables context-aware chatbot responses using external sources"
  ],
  icon: "🔍",
  color: "#ec4899"
}
,
{
  name: "Prosus Track (via uAgents)",
  description: "Used for intelligent tracking, coaching, and quiz/chat support using autonomous agents.",
  usage: [
    "CoachAgent → motivational messages and progress advice",
    "QuizAgent → real-time quiz handling with adaptive feedback",
    "ChatbotAgent → conversational support with dynamic response generation"
  ],
  icon: "🤖",
  color: "#a855f7"
}


];

function APIs() {
  return (
    <div className="features-page">
      <Navbar />
      <div className="decoration-element decor-1"></div>
      <div className="decoration-element decor-2"></div>
      
      <div className="features-container">
        <div className="features-header">
          <h1 className="features-title">API Integrations</h1>
          <p className="features-subtitle">
            Discover the powerful APIs that bring intelligence to YnityLearn
          </p>
        </div>

        <div className="features-grid">
          {apiData.map((api, index) => (
            <div 
              className="feature-card" 
              key={index}
              style={{ '--card-color': api.color }}
            >
              <div className="card-icon" style={{ backgroundColor: api.color }}>
                {api.icon}
              </div>
              <h2 className="feature-name">{api.name}</h2>
              <p className="feature-description">{api.description}</p>
              
              <div className="feature-usage">
                <h3>Usage Examples</h3>
                <ul>
                  {api.usage.map((item, i) => (
                    <li key={i}>
                      <span className="usage-bullet" style={{ backgroundColor: api.color }}></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default APIs;