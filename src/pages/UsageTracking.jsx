import React, { useEffect, useState } from "react";
import "./styles/UsageTracking.css";
import Navbar from "../components/Navbar";

const UsageTracking = () => {
  const [usages, setUsages] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/usage`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setUsages(data))
      .catch((err) => console.error("Error loading usage:", err));
  }, []);

  const formatOutput = (type, output) => {
    try {
      if (typeof output === 'string') {
        if (output.startsWith('[') || output.startsWith('{')) {
          return JSON.stringify(JSON.parse(output), null, 2);
        }
        return output;
      }
      return JSON.stringify(output, null, 2);
    } catch {
      return output;
    }
  };

  return (
    <div className="features-page">
      <Navbar />
      <div className="decoration-element decor-1"></div>
      <div className="decoration-element decor-2"></div>
      
      <div className="features-container">
        <div className="features-header">
          <h1 className="features-title">Tavily Search (Real-time Enrichment)</h1>
          <p className="features-subtitle">
            History of interactions with AI features
          </p>
        </div>

        <div className="features-grid">
          {usages.map((u, i) => {
            const typeColor = getColorForType(u.type);
            const typeLabel = getTypeLabel(u.type);
            
            return (
              <div className="feature-card" key={i}>
                {typeLabel}
                
                <div className="usage-meta">
                  <span className="usage-date">{new Date(u.createdAt).toLocaleString()}</span>
                </div>
                
                <div className="usage-body">
                  <p><strong>👤 User:</strong> {u.user?.name || "Unknown"}</p>
                  <p><strong>Prompt:</strong> {u.prompt}</p>
                  
                  <div className="output-container">
                    <strong>Generated Content:</strong>
                    <pre className="output-content">
                      {formatOutput(u.type, u.output)}
                    </pre>
                  </div>
                  
                  {u.tavilyAnswer && (
                    <div className="tavily-info">
                      <strong>Context:</strong>
                      <p>{u.tavilyAnswer}</p>
                    </div>
                  )}
                  
                  {u.tavilySources?.length > 0 && (
                    <div className="feature-usage">
                      <h3>Used Sources</h3>
                      <ul>
                        {u.tavilySources.map((s, idx) => (
                          <li key={idx}>
                            <span className="usage-bullet" style={{ backgroundColor: typeColor }}></span>
                            <a href={s.url} target="_blank" rel="noreferrer">{s.title}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Helper functions
const getColorForType = (type) => {
  const colors = {
    chat: '#6a11cb',
    summary: '#2575fc',
    flashcard: '#10b981',
    exam: '#f59e0b',
    planning: '#6366f1',
    default: '#8b5cf6'
  };
  return colors[type?.toLowerCase()] || colors.default;
};

const getTypeLabel = (type) => {
  const labels = {
    chat: 'Conversation',
    summary: 'Summary',
    flashcard: 'Flashcards',
    exam: 'Exam',
    planning: 'Planning',
    default: 'Usage'
  };
  return labels[type?.toLowerCase()] || labels.default;
};

export default UsageTracking;
