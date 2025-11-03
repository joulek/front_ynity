import React, { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FaMicrophone, FaPaperPlane, FaTrash, FaEdit, FaFileUpload } from "react-icons/fa";
import "../pages/styles/Chatbot.css";

export default function Chatbot() {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(false);

  // Modal states
  const [showNewModal, setShowNewModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalInput, setModalInput] = useState("");
  const [pendingConvId, setPendingConvId] = useState(null);

  const chatEndRef = useRef(null);
  const API = import.meta.env.VITE_BACKEND_URL + "/api/chatbot";

  useEffect(() => {
    fetch(`${API}/all`, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        setConversations(data);
        if (data.length > 0) loadConversation(data[0]._id);
      });
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversation = async (id) => {
    const res = await fetch(`${API}/${id}`, { credentials: "include" });
    const conv = await res.json();
    const mapped = conv.messages.map(m => {
      if (m.role === "coach") return { type: "coach-text", text: m.content };
      if (m.imageUrl) return { type: "bot-image", imageUrl: m.imageUrl };
      if (m.audioUrl) return { type: "bot-audio", audioUrl: `${import.meta.env.VITE_BACKEND_URL}${m.audioUrl}` };
      return { type: m.role === "user" ? "user" : "bot-text", text: m.content };
    });
    setMessages(mapped);
    setActiveConversation(conv._id);

    document.querySelector(".chat-sidebar")?.classList.remove("open");
  };

  const createConversation = async () => {
    setModalInput("");
    setShowNewModal(true);
  };

  const confirmCreateConversation = async () => {
    const res = await fetch(`${API}/new`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ title: modalInput || "New Conversation" }),
    });
    const newConv = await res.json();
    setConversations([newConv, ...conversations]);
    setActiveConversation(newConv._id);
    setMessages([]);
    setShowNewModal(false);
  };

  const sendQuestion = async () => {
    if (!question.trim()) return;
    setMessages(prev => [...prev, { type: "user", text: question }]);
    const q = question;
    setQuestion("");
    setLoading(true);

    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ question: q, conversationId: activeConversation }),
    });

    const data = await res.json();
    setMessages(prev => [...prev, { type: data.source === "coach" ? "coach-text" : "bot-text", text: data.content }]);
    setLoading(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMessages(prev => [...prev, { type: "user", text: `📎 ${file.name}` }]);
    const form = new FormData();
    form.append("file", file);
    form.append("userPrompt", question);
    const res = await fetch(`${API}/file`, { method: "POST", body: form });
    const data = await res.json();
    setMessages(prev => [...prev, { type: "bot-text", text: data.response }]);
  };

  const handleVoiceInput = () => {
    const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Speech) return alert("Voice not supported");
    const rec = new Speech();
    rec.lang = "fr-FR";
    rec.start();
    rec.onresult = e => {
      const text = e.results[0][0].transcript;
      setQuestion(text);
      setTimeout(sendQuestion, 300);
    };
  };

  const openRenameModal = (c) => {
    setPendingConvId(c._id);
    setModalInput(c.title);
    setShowRenameModal(true);
  };

  const openDeleteModal = (c) => {
    setPendingConvId(c._id);
    setShowDeleteModal(true);
  };

  const confirmRename = async () => {
    await fetch(`${API}/rename/${pendingConvId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ title: modalInput }),
    });
    setConversations(prev => prev.map(x => x._id === pendingConvId ? { ...x, title: modalInput } : x));
    setShowRenameModal(false);
  };

  const confirmDelete = async () => {
    await fetch(`${API}/delete/${pendingConvId}`, { method: "DELETE", credentials: "include" });
    const remain = conversations.filter(x => x._id !== pendingConvId);
    setConversations(remain);
    if (remain[0]) loadConversation(remain[0]._id);
    else { setMessages([]); setActiveConversation(null); }
    setShowDeleteModal(false);
  };

  return (
    <div className="chat-page">
      <Navbar />

      {/* ✅ Mobile toggle button */}
      <button 
        className="sidebar-toggle"
        onClick={() => {
          document.querySelector(".chat-sidebar").classList.toggle("open");
        }}
      >☰</button>

      <div className="chat-layout">

        {/* Sidebar */}
        <aside className="chat-sidebar">
          <button className="new-chat-btn" onClick={createConversation}>+ New Chat</button>
          <input className="sidebar-search" placeholder="Search..." value={filterText} onChange={e => setFilterText(e.target.value)} />

          <DragDropContext onDragEnd={({ destination, source }) => {
            if (!destination || source.index === destination.index) return;
            const updated = [...conversations];
            const [moved] = updated.splice(source.index, 1);
            updated.splice(destination.index, 0, moved);
            setConversations(updated);
          }}>
            <Droppable droppableId="conv">
              {provided => (
                <ul className="chat-list" ref={provided.innerRef} {...provided.droppableProps}>
                  {conversations
                    .filter(c => c.title?.toLowerCase().includes(filterText.toLowerCase()))
                    .map((c, idx) => (
                      <Draggable draggableId={c._id} key={c._id} index={idx}>
                        {drag => (
                          <li className={`chat-list-item ${activeConversation === c._id ? "active" : ""}`}
                            ref={drag.innerRef} {...drag.draggableProps} {...drag.dragHandleProps}>
                            
                            <span onClick={() => loadConversation(c._id)}>{c.title}</span>

                            <div className="conv-menu">
                              <button onClick={() => openRenameModal(c)}><FaEdit /></button>
                              <button onClick={() => openDeleteModal(c)}><FaTrash /></button>
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

        {/* Chat Box */}
        <div className="chat-box">
          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="empty-chat">💬 Start a conversation...</div>
            ) : (
              messages.map((m, i) => (
                <div key={i} className={`bubble ${m.type}`}>{m.text}</div>
              ))
            )}
            {loading && <div className="bubble bot">🤖 typing...</div>}
            <div ref={chatEndRef}></div>
          </div>

          {/* Input */}
          <div className="chat-input-bar">
            <label className="icon-btn">
              <FaFileUpload />
              <input type="file" hidden onChange={handleFileUpload}/>
            </label>

            <button className="icon-btn" onClick={handleVoiceInput}><FaMicrophone /></button>

            <input className="chat-input" placeholder="Type your message..."
              value={question} onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendQuestion()} />

            <button className="send-btn" onClick={sendQuestion}><FaPaperPlane /></button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showNewModal && (
        <div className="modal-overlay"><div className="modal">
          <h3>Create New Chat</h3>
          <input className="modal-input" placeholder="Chat name..."
            value={modalInput} onChange={(e)=>setModalInput(e.target.value)} />
          <div className="modal-actions">
            <button className="modal-btn cancel" onClick={()=>setShowNewModal(false)}>Cancel</button>
            <button className="modal-btn confirm" onClick={confirmCreateConversation}>Create</button>
          </div>
        </div></div>
      )}

      {showRenameModal && (
        <div className="modal-overlay"><div className="modal">
          <h3>Rename Conversation</h3>
          <input className="modal-input" value={modalInput}
            onChange={(e)=>setModalInput(e.target.value)} />
          <div className="modal-actions">
            <button className="modal-btn cancel" onClick={()=>setShowRenameModal(false)}>Cancel</button>
            <button className="modal-btn confirm" onClick={confirmRename}>Save</button>
          </div>
        </div></div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay"><div className="modal">
          <h3>Delete Conversation?</h3>
          <p>This action cannot be undone.</p>
          <div className="modal-actions">
            <button className="modal-btn cancel" onClick={()=>setShowDeleteModal(false)}>Cancel</button>
            <button className="modal-btn delete" onClick={confirmDelete}>Delete</button>
          </div>
        </div></div>
      )}
    </div>
  );
}
