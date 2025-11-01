import React, { useState, useRef, useEffect } from "react";
import { FaMicrophone, FaSpinner, FaTimes, FaRobot, FaPaperclip, FaDownload } from "react-icons/fa";
import "../pages/styles/Chatbot.css";

export default function ChatBubble() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            type: "bot",
            text: "Bonjour ! Comment puis-je vous aider aujourd'hui ? Qu'est-ce que vous étudiez actuellement ?"
        }
    ]);
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    const [recording, setRecording] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);
    const chatEndRef = useRef(null);
    const API = import.meta.env.VITE_BACKEND_URL + "/api/chatbot";

    useEffect(() => {
        if (isOpen) {
            chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
            setHasUnread(false);
        } else if (messages.length > 1) {
            setHasUnread(true);
        }
    }, [messages, isOpen]);

    const sendQuestion = async () => {
        const q = question.trim();
        if (!q || loading) return;

        setMessages((prev) => [...prev, { type: "user", text: q }]);
        setQuestion("");
        setLoading(true);

        try {
            const response = await fetch(API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    question: q,
                    useVoice: wantsVoice,
                }),
            });

            const data = await response.json();

            if (data.imageUrl) {
                setMessages((prev) => [
                    ...prev,
                    { type: "bot-image", imageUrl: data.imageUrl },
                ]);
            } else if (data.audioUrl) {
                const fullAudioUrl = `${import.meta.env.VITE_BACKEND_URL}${data.audioUrl}`;
                setMessages((prev) => [
                    ...prev,
                    { type: "bot-audio", audioUrl: fullAudioUrl },
                ]);
            } else if (data.fileUrl) {
                const fullFileUrl = `${import.meta.env.VITE_BACKEND_URL}${data.fileUrl}`;
                setMessages((prev) => [
                    ...prev,
                    {
                        type: "bot-text",
                        text: data.content,
                        fileLink: fullFileUrl,
                    },
                ]);
            } else if (data.content) {
                setMessages((prev) => [
                    ...prev,
                    { type: "bot", text: data.content },
                ]);
            }
        } catch (err) {
            console.error("Erreur envoi:", err);
            setMessages((prev) => [
                ...prev,
                { type: "error", text: "❌ Erreur de communication avec le serveur." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleVoiceInput = () => {
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
    };

    return (
        <div className={`chat-bubble-container ${isOpen ? "open" : ""}`}>
            {isOpen ? (
                <div className="chat-bubble-content">
                    <div className="chat-bubble-header">
                        <h3>
                            <FaRobot style={{ marginRight: "8px" }} />
                            Assistant IA
                        </h3>
                        <button onClick={() => setIsOpen(false)} className="close-btn">
                            <FaTimes />
                        </button>
                    </div>
                    <div className="chat-bubble-messages">
                        {messages.map((m, i) => (
                            <div key={i} className={`chat-message ${m.type}`}>
                                {m.type === "bot-text" && m.fileLink ? (
                                    <div>
                                        {m.text}
                                        <a
                                            href={m.fileLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="download-link"
                                        >
                                            <FaDownload /> Télécharger le fichier
                                        </a>
                                    </div>
                                ) : m.type === "bot-audio" ? (
                                    <audio controls src={m.audioUrl} style={{ width: "100%" }} />
                                ) : m.type === "bot-image" ? (
                                    <div style={{ textAlign: "center" }}>
                                        <img
                                            src={m.imageUrl}
                                            alt="Image générée par IA"
                                            className="generated-image"
                                        />
                                        <a
                                            href={m.imageUrl}
                                            download="image_ia.png"
                                            className="download-link"
                                        >
                                            <FaDownload /> Télécharger l'image
                                        </a>
                                    </div>
                                ) : (
                                    <div>{m.text}</div>
                                )}
                            </div>
                        ))}
                        {loading && (
                            <div className="chat-message bot">
                                <FaSpinner className="spinner" /> Je réfléchis...
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>
                    <div className="chat-bubble-input">
                        <input
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendQuestion()}
                            placeholder="Écrivez votre message ici..."
                            disabled={loading || recording}
                        />
                        <button
                            onClick={handleVoiceInput}
                            disabled={recording || loading}
                            className={`mic-btn ${recording ? "active" : ""}`}
                            title="Parler"
                        >
                            <FaMicrophone />
                        </button>
                        <button
                            onClick={sendQuestion}
                            disabled={!question.trim() || loading}
                            className="send-btn"
                        >
                            ➤
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="chat-bubble-toggle"
                    aria-label="Ouvrir le chat"
                >
                    <FaRobot size={24} />
                    {hasUnread && <span className="notification-badge">!</span>}
                </button>
            )}
        </div>
    );
}