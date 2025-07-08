import React, { useState, useRef, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FaMicrophone, FaSpinner } from "react-icons/fa";
import "../pages/styles/Chatbot.css";

export default function Chatbot() {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [useVoice, setUseVoice] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");

  const chatEndRef = useRef(null);
  const currentAudioRef = useRef(null);
  const API = import.meta.env.VITE_BACKEND_URL + "/api/chatbot";

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch(`${API}/all`, { credentials: "include" });
        const data = await res.json();
        setConversations(data);
        if (data.length > 0) loadConversation(data[0]._id);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    // Utiliser le texte saisi dans le champ input comme prompt
    formData.append("userPrompt", question);

    setMessages((prev) => [
      ...prev,
      { type: "user", text: `📎 [File sent: ${file.name}]` },
    ]);

    setLoading(true);

    try {
      const res = await fetch(`${API}/file`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error while analyzing file.");
      }

      setMessages((prev) => [...prev, { type: "bot", text: data.response }]);
    } catch (err) {
      console.error("Error while analyzing file :", err);
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "❌ Error while analyzing filer." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  function formatBotResponse(text) {
    if (!text) return "";

    // Remplace les retours à la ligne par <br> pour garder les paragraphes
    let formatted = text.replace(/\n/g, "<br>");

    // Transforme les listes "1. xxx" ou "2. xxx" en balises <ol><li>
    formatted = formatted.replace(
      /(?:<br>)?\d+\.\s(.+?)(?=(<br>\d+\.|$))/g,
      (_, item) => `<li>${item.trim()}</li>`
    );

    // Si on trouve au moins une <li>, on encapsule dans <ol>
    if (formatted.includes("<li>")) {
      formatted = `<ol style="padding-left: 1.5rem; list-style-type: decimal;">${formatted}</ol>`;
    }

    return formatted;
  }

  const loadConversation = useCallback(async (id) => {
    try {
      const res = await fetch(`${API}/${id}`, { credentials: "include" });
      const conv = await res.json();
      const mapped = conv.messages.map((m) => {
        if (m.imageUrl) {
          return { type: "bot-image", imageUrl: m.imageUrl };
        }
        if (m.role === "bot" && m.audioUrl) {
          return {
            type: "bot-audio",
            audioUrl: `${import.meta.env.VITE_BACKEND_URL}${m.audioUrl}`,
          };
        }
        if (m.role === "coach") {
          return { type: "coach-text", text: m.content };
        }

        return {
          type: m.role === "bot" ? "bot-text" : "user",
          text: m.content,
        };
      });

      setMessages(mapped);
      setActiveConversation(conv._id);
    } catch (error) {
      console.error("Error loading conversation:", error);
    }
  }, []);

  const createConversation = useCallback(async () => {
    try {
      // Demander à l'utilisateur un titre ou utiliser une valeur par défaut
      const userTitle = prompt(
        "Give a name for this conversation:",
        "New conversation"
      );

      const res = await fetch(`${API}/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: userTitle || "New conversation",
        }),
      });
      const newConv = await res.json();
      setConversations([newConv, ...conversations]);
      setActiveConversation(newConv._id);
      setMessages([]);
      return newConv._id;
    } catch (error) {
      console.error("Error creating conversation:", error);
      return null;
    }
  }, [conversations]);

  const playAudio = useCallback((audioUrl) => {
    if (currentAudioRef.current) currentAudioRef.current.pause();
    const audio = new Audio(audioUrl);
    currentAudioRef.current = audio;
    setSpeaking(true);
    audio.play();
    audio.onended = () => setSpeaking(false);
    audio.onerror = () => setSpeaking(false);
  }, []);

  const sendQuestion = useCallback(async () => {
    const q = question.trim();
    if (!q || loading) return;

    // Ajouter message utilisateur dans l'historique
    setMessages((prev) => [...prev, { type: "user", text: q }]);
    setQuestion("");
    setLoading(true);

    try {
      const convId = activeConversation || (await createConversation());

      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          question: q,
          conversationId: convId,
          useVoice: false,
        }),
      });

      const data = await response.json();

      // 1️⃣ Solution optimale pour le coach - recharge la conversation complète
      if (data.source === "coach") {
        const updatedConv = await fetch(`${API}/${convId}`, {
          credentials: "include"
        }).then(res => res.json());

        const mappedMessages = updatedConv.messages.map((m) => {
          if (m.imageUrl) {
            return { type: "bot-image", imageUrl: m.imageUrl };
          }
          if (m.role === "bot" && m.audioUrl) {
            return {
              type: "bot-audio",
              audioUrl: `${import.meta.env.VITE_BACKEND_URL}${m.audioUrl}`,
            };
          }
          if (m.role === "coach") {
            return {
              type: "coach-text",
              text: m.content,
              isCoach: true
            };
          }
          return {
            type: m.role === "bot" ? "bot-text" : "user",
            text: m.content,
          };
        });

        setMessages(mappedMessages);
        return;
      }

      // 2️⃣ Cas réponse avec IMAGE (inchangé)
      if (data.imageUrl) {
        setMessages((prev) => [
          ...prev,
          {
            type: "bot-image",
            imageUrl: data.imageUrl,
            isCoach: false
          }
        ]);
      }

      // 3️⃣ Cas réponse avec AUDIO (inchangé)
      else if (data.audioUrl) {
        const fullAudioUrl = `${import.meta.env.VITE_BACKEND_URL}${data.audioUrl}`;
        setMessages((prev) => [
          ...prev,
          {
            type: "bot-audio",
            audioUrl: fullAudioUrl,
            isCoach: false
          }
        ]);
        playAudio(fullAudioUrl);
      }

      // 4️⃣ Cas réponse avec FICHIER PDF (inchangé)
      else if (data.fileUrl) {
        const fullFileUrl = `${import.meta.env.VITE_BACKEND_URL}${data.fileUrl}`;
        setMessages((prev) => [
          ...prev,
          {
            type: "bot-text",
            text: data.content,
            fileLink: fullFileUrl,
            isCoach: false
          }
        ]);
      }

      // 5️⃣ Cas réponse TEXTE standard (inchangé)
      else if (data.content) {
        setMessages((prev) => [
          ...prev,
          {
            type: "bot-text",
            text: data.content,
            isCoach: false
          }
        ]);
      }

    } catch (err) {
      console.error("Error sending question:", err);
      setMessages((prev) => [
        ...prev,
        {
          type: "error",
          text: "❌ Error communicating with the server.",
          isCoach: false
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, [question, loading, activeConversation, createConversation, playAudio]);

  const handleVoiceInput = useCallback(() => {
    const Recognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      alert("Navigateur incompatible avec la reconnaissance vocale.");
      return;
    }
    const recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.start();
    setRecording(true);
    recognition.onresult = async (e) => {
      const transcript = e.results[0][0].transcript;
      setQuestion(transcript);
      setRecording(false);
      sendQuestion(transcript);
    };
    recognition.onerror = (e) => {
      console.error("Erreur vocale:", e.error);
      setRecording(false);
    };
  }, [sendQuestion]);

  return (
    <div>
      <Navbar />
      <div className="page-header-subject">
        <h1 className="page-title-subject"> Assistant IA</h1>
      </div>

      <div className="chatbot-wrapper">
        <aside className="sidebar">
          <button onClick={createConversation} style={{ borderColor: "blue" }}>
            + New conversation
          </button>
          <DragDropContext
            onDragEnd={({ destination, source }) => {
              if (!destination || destination.index === source.index) return;
              const reordered = [...conversations];
              const [moved] = reordered.splice(source.index, 1);
              reordered.splice(destination.index, 0, moved);
              setConversations(reordered);
            }}
          >
            <input
              type="text"
              placeholder="🔍 Filter..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="conversation-filter-input"
            />

            <Droppable droppableId="conv">
              {(provided) => (
                <ul
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="conversation-list"
                >
                  {conversations
                    .filter((c) =>
                      c.title?.toLowerCase().includes(filterText.toLowerCase())
                    )
                    .map((c, idx) => (
                      <Draggable key={c._id} draggableId={c._id} index={idx}>
                        {(drag) => (
                          <li
                            ref={drag.innerRef}
                            {...drag.draggableProps}
                            {...drag.dragHandleProps}
                            className={`conversation-item ${activeConversation === c._id ? "active" : ""
                              }`}
                          >
                            <span onClick={() => loadConversation(c._id)}>
                              {c.title || "Without title"}
                            </span>
                            <div className="conversation-actions">
                              <button
                                onClick={() => {
                                  const t = prompt("New title:", c.title);
                                  if (t) {
                                    fetch(`${API}/rename/${c._id}`, {
                                      method: "PUT",
                                      headers: {
                                        "Content-Type": "application/json",
                                      },
                                      credentials: "include",
                                      body: JSON.stringify({ title: t }),
                                    })
                                      .then((r) => r.json())
                                      .then((updated) =>
                                        setConversations((prev) =>
                                          prev.map((x) =>
                                            x._id === c._id ? updated : x
                                          )
                                        )
                                      );
                                  }
                                }}
                              >
                                ✏️
                              </button>
                              <button
                                onClick={async () => {
                                  if (!confirm("Delete ?")) return;
                                  await fetch(`${API}/delete/${c._id}`, {
                                    method: "DELETE",
                                    credentials: "include",
                                  });
                                  const remaining = conversations.filter(
                                    (x) => x._id !== c._id
                                  );
                                  setConversations(remaining);
                                  if (activeConversation === c._id) {
                                    if (remaining[0])
                                      loadConversation(remaining[0]._id);
                                    else {
                                      setActiveConversation(null);
                                      setMessages([]);
                                    }
                                  }
                                }}
                              >
                                🗑️
                              </button>
                            </div>
                          </li>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </aside>
        <section className="chat-container">
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-message ${m.type}`}>
                {m.type === "coach-text" ? (
                  <div
                    style={{
                      backgroundColor: "#ffefd5",
                      borderLeft: "4px solid orange",
                      padding: "8px",
                      borderRadius: "6px",
                    }}
                  >
                    🧠 <strong>Coach:</strong>
                    <br />
                    {m.text}
                  </div>
                ) : m.type === "bot-text" && m.fileLink ? (
                  <div>
                    {m.text}
                    <a
                      href={m.fileLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        marginLeft: 8,
                        color: "#0a7",
                        fontWeight: "bold",
                      }}
                    >
                      📎
                    </a>
                  </div>
                ) : m.type === "bot-audio" ? (
                  <audio controls src={m.audioUrl} style={{ width: "100%" }} />
                ) : m.type === "bot-image" ? (
                  <div style={{ textAlign: "center" }}>
                    <img
                      src={m.imageUrl}
                      alt="Image generated by AI"
                      style={{
                        maxWidth: "100%",
                        borderRadius: "8px",
                        marginBottom: "8px",
                      }}
                    />
                    <a
                      href={m.imageUrl}
                      download="image_ia.png"
                      className="btn-download"
                      style={{
                        display: "inline-block",
                        background: "#0a7",
                        color: "white",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        textDecoration: "none",
                        fontSize: "0.9rem",
                      }}
                    >
                      ⬇️ Download
                    </a>
                  </div>
                ) : (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: formatBotResponse(m.text),
                    }}
                  ></div>
                )}
              </div>
            ))}

            <div className="chat-input-container">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendQuestion()}
                placeholder="Ask your question..."
                disabled={loading || recording}
              />
              <label className="upload-label">
                📎
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.jpg,.jpeg,.png,"
                  hidden
                  onChange={handleFileUpload}
                />
              </label>

              <button onClick={handleVoiceInput} disabled={recording || loading}>
                🎤
              </button>
              <button
                onClick={sendQuestion}
                disabled={!question.trim() || loading}
              >
                Send
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
