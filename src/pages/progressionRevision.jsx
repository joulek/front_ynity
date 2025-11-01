import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { Clock, Smile, Lightbulb, BookMarked, Sparkles, TrendingUp, BarChart2, Zap } from "lucide-react";
import "../pages/styles/ProgressionRevision.css";

function ProgressionRevision() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/revision/analyze`, {}, {
        withCredentials: true,
      })
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur d'analyse IA :", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <motion.div
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
          className="loading-circle"
        />
        <p className="loading-text">
          🧠 Our AI, powered by <span className="highlight-groq">Groq</span> and the <span className="highlight-llama">LLaMA&nbsp;3</span> model,<br/> is analyzing your revision data...
        </p>
      </div>
    );
  }


  return (
    <div className="progression-page pb-10">
      <Navbar />

      <div className="page-header-revision">
        <h1 className="page-title-revision">Revision Progress Tracker</h1>
      </div>

      <div className="container mx-auto px-4">
        {/* Motivational message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="ai-advice-footer"
        >
          <Sparkles className="w-6 h-6 text-purple-500 mx-auto mb-3" />
          <p className="text-lg font-medium">
            "Each minute of revision brings you closer to your goals. Keep going!"
          </p>
        </motion.div>

        {/* Main card */}
        <div className="main-card">
          <div className="p-8 space-y-8">
            {/* Stats section */}
            <div className="stats-grid">
              {/* Time card */}
              <motion.div
                whileHover={{ y: -5 }}
                className="stat-card time-card"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <motion.div
                    className="card-icon-container bg-blue-500/20"
                    whileHover={{ rotate: 10 }}
                  >
                    <Clock className="w-6 h-6 text-blue-600" />
                  </motion.div>
                  <h3 className="card-title text-blue-800">Revised Time</h3>
                </div>
                <p className="card-content text-blue-900">
                  {data.totalMinutes}
                  <span className="text-lg ml-1">minutes</span>
                </p>
                <div className="absolute right-0 bottom-0 overflow-hidden rounded-br-xl">
                  <motion.div
                    animate={{
                      opacity: [0.3, 0.5, 0.3],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-24 h-24 bg-blue-200/20 rounded-tl-full"
                  />
                </div>
              </motion.div>

              {/* Emotion card */}
              <motion.div
                whileHover={{ y: -5 }}
                className="stat-card emotion-card"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <motion.div
                    className="card-icon-container bg-purple-500/20"
                    whileHover={{ rotate: 10 }}
                  >
                    <Smile className="w-6 h-6 text-purple-600" />
                  </motion.div>
                  <h3 className="card-title text-purple-800">Emotional State</h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className="card-content text-purple-900 capitalize">
                    {data.emotion}
                  </span>
                  {data.emotion === "motivated" && (
                    <motion.span
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity
                      }}
                      className="text-yellow-500 text-2xl"
                    >
                      ✨
                    </motion.span>
                  )}
                </div>
                <div className="absolute right-0 bottom-0 overflow-hidden rounded-br-xl">
                  <motion.div
                    animate={{
                      opacity: [0.3, 0.5, 0.3],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                    className="w-24 h-24 bg-purple-200/20 rounded-tl-full"
                  />
                </div>
              </motion.div>

              {/* Advice card */}
              <motion.div
                whileHover={{ y: -5 }}
                className="stat-card advice-card col-span-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <motion.div
                    className="card-icon-container bg-amber-500/20"
                    whileHover={{ rotate: 10 }}
                  >
                    <Lightbulb className="w-6 h-6 text-amber-600" />
                  </motion.div>
                  <h3 className="card-title text-amber-800">AI Suggestion</h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {data.suggestion}
                </p>
                <div className="absolute right-0 bottom-0 overflow-hidden rounded-br-xl">
                  <motion.div
                    animate={{
                      opacity: [0.3, 0.5, 0.3],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                    className="w-24 h-24 bg-amber-200/20 rounded-tl-full"
                  />
                </div>
              </motion.div>
            </div>

            {/* Revision details section */}
            <section className="revision-section">
              <header className="revision-section-header">
                <BookMarked className="icon" />
                <h3>Revision Details</h3>
              </header>

              <div className="revision-grid">
                {data.breakdown.map((rev, i) => (
                  <motion.article
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, type: "spring", stiffness: 100 }}
                    whileHover={{ scale: 1.03 }}
                    className={`revision-card ${rev.duration > 0
                      ? "revision-card-active"
                      : "revision-card-inactive"
                      }`}
                  >
                    <div className="relative z-10">
                      <h4 className="rev-title flex items-center gap-2">
                        {rev.duration > 0 ? (
                          <motion.span
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            ✅
                          </motion.span>
                        ) : (
                          <span>⏱️</span>
                        )}
                        {rev.title}
                      </h4>

                      <p className="rev-date">
                        <Clock size={14} /> {rev.date}
                      </p>

                      <motion.span
                        whileHover={{ scale: 1.1 }}
                        className={`rev-duration ${rev.duration > 0
                          ? "rev-duration-active"
                          : "rev-duration-inactive"
                          }`}
                      >
                        {rev.duration} min
                      </motion.span>
                    </div>

                    {rev.duration > 0 && (
                      <motion.div
                        className="absolute bottom-0 right-0 w-16 h-16 bg-white/10 rounded-tl-full"
                        animate={{
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    )}
                  </motion.article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgressionRevision;