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

  const speakText = useCallback((text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    window.speechSynthesis.speak(utterance);
  }, []);

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  const loadConversation = useCallback(async (id) => {
    try {
      const res = await fetch(`${API}/${id}`, { credentials: "include" });
      const conv = await res.json();
      const mapped = conv.messages.map((m) => {
        if (m.role === "bot" && m.audioUrl) {
          return {
            type: "bot-audio",
            audioUrl: `${import.meta.env.VITE_BACKEND_URL}${m.audioUrl}`,
          };
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
      const res = await fetch(`${API}/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title: "Nouvelle conversation" }),
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
    setMessages((prev) => [...prev, { type: "user", text: q }]);
    setQuestion("");
    setLoading(true);
    try {
      const convId = activeConversation || (await createConversation());
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ question: q, conversationId: convId, useVoice }),
      });
      const data = await response.json();
      if (useVoice && data.audioUrl) {
        const fullAudioUrl = `${import.meta.env.VITE_BACKEND_URL}${data.audioUrl}`;
        setMessages((prev) => [...prev, { type: "bot-audio", audioUrl: fullAudioUrl }]);
        playAudio(fullAudioUrl);
      } else if (data.content) {
        setMessages((prev) => [...prev, { type: "bot-text", text: data.content }]);
        if (useVoice) speakText(data.content);
      }
    } catch (err) {
      console.error("Erreur envoi:", err);
      setMessages((prev) => [...prev, { type: "error", text: "Erreur de communication" }]);
    } finally {
      setLoading(false);
    }
  }, [question, loading, activeConversation, useVoice, speakText, playAudio]);

  const handleVoiceInput = useCallback(() => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      alert("Navigateur incompatible avec la reconnaissance vocale.");
      return;
    }
    const recognition = new Recognition();
    recognition.lang = "fr-FR";
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
    <div className="chatbot-page">
      <Navbar />
      <div className="chatbot-wrapper">
        <aside className="sidebar">
          <button onClick={createConversation}>+ Nouvelle conversation</button>
          <ul>
            {conversations.map((c) => (
              <li
                key={c._id}
                className={activeConversation === c._id ? "active" : ""}
                onClick={() => loadConversation(c._id)}
              >
                {c.title || "Sans titre"}
              </li>
            ))}
          </ul>
        </aside>
        <section className="chat-container">
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-message ${m.type}`}>
                {m.type === "bot-audio" ? (
                  <audio controls src={m.audioUrl} />
                ) : (
                  <div>{m.text}</div>
                )}
              </div>
            ))}
            {loading && (
              <div className="chat-message bot">
                <FaSpinner className="spinner" /> En cours...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="chat-input-container">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendQuestion()}
              placeholder="Pose ta question…"
              disabled={loading || recording}
            />
            <button onClick={handleVoiceInput} disabled={recording || loading}>
              🎤
            </button>
            <button onClick={sendQuestion} disabled={!question.trim() || loading}>
              Envoyer
            </button>
            <button onClick={stopSpeaking} disabled={!speaking}>
              🔇 Stop
            </button>
            <label>
              <input type="checkbox" checked={useVoice} onChange={() => setUseVoice(!useVoice)} />
              Réponse vocale
            </label>
          </div>
        </section>
      </div>
    </div>
  );
}