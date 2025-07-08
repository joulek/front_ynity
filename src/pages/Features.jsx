import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import "../pages/styles/Features.css";
import featuresVid from "../assets/FEATURES.mp4";

const features = [
    {
        title: "Smart Summaries",
        description: "AI-generated concise summaries for faster understanding of your courses.",
        icon: "📄",
        color: "#6a11cb"
    },
    {
        title: "AI Flashcards",
        description: "Memorize better with spaced repetition flashcards generated from your materials.",
        icon: "🧠",
        color: "#2575fc"
    },
    {
        title: "Smart Planning",
        description: "Create a personalized revision calendar based on your time and exam priorities.",
        icon: "🗓️",
        color: "#10b981"
    },
    {
        title: "Progress Tracking",
        description: "Visualize your performance and monitor improvement over time.",
        icon: "📊",
        color: "#f59e0b"
    },
    {
        title: "Live Quizzes",
        description: "Challenge friends or revise solo in real-time AI-powered quizzes.",
        icon: "🎓",
        color: "#6366f1"
    },
    {
        title: "AI Chatbot",
        description: "Ask questions and get instant explanations from our intelligent tutor.",
        icon: "🤖",
        color: "#ec4899"
    },
    {
        title: "Notifications",
        description: "Receive smart reminders and motivational messages to stay on track.",
        icon: "🔔",
        color: "#8b5cf6"
    },
    {
        title: "Exam Generator",
        description: "Automatically create custom exams with AI based on your course content.",
        icon: "📝",
        color: "#3b82f6"
    }
];

export default function Features() {
    return (
        <div className="features-page">
            <Navbar />
            <div className="decoration-element decor-1"></div>
            <div className="decoration-element decor-2"></div>

            <div className="features-container">
                {/* Hero Section */}


                <div className="features-container">
                    <div className="features-header">
                        <h1 className="features-title">✨ Discover YnityLearn</h1>
                        <p className="features-subtitle">
                            YnityLearn is your all-in-one intelligent learning companion. Generate summaries,
                            flashcards, personalized revision plans, and track your progress — all powered by AI.          </p>
                    </div>
                </div>
                    {/* Features Grid */}
                    <div className="features-grid">
                        {features.map((feat, index) => (
                            <motion.div
                                className="feature-card"
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                style={{ '--card-color': feat.color }}
                            >
                                <div className="card-icon" style={{ backgroundColor: feat.color }}>
                                    {feat.icon}
                                </div>
                                <h2 className="feature-name">{feat.title}</h2>
                                <p className="feature-description">{feat.description}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Video Section */}
                    <motion.div
                        className="video-section"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <h2 className="video-title">
                            <span className="icon">🎥</span> See YnityLearn in Action
                        </h2>
                        <div className="video-container">
                            <video controls width="100%" poster="/path-to-poster.jpg">
                                <source src={featuresVid} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </motion.div>
                </div>
            </div>
            );
}