import React from "react";
import "../pages/styles/Home.css";
import { FaArrowRight } from "react-icons/fa";
import logo from "../assets/logo_final_sansbg.png";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import teamMember1 from "../assets/yosr.jpg";
import teamMember2 from "../assets/nourhene.jpg";
import teamMember3 from "../assets/hounaida.jpg";


import courseImg from "../assets/course-personalized.png";
import progressImg from "../assets/progress-tracking.png";
import aiImg from "../assets/smart-resources.png";
import summaryImg from "../assets/summary-ia-sansbg.png";
import revisionImg from "../assets/smart-revision.png";
import flashcardImg from "../assets/smart-flashcards.png";
import learningImg from "../assets/ia-learning.png";




import { motion } from "framer-motion";

function Home() {
  return (
    <>
      <Navbar />
      <div className="home-container">
        {/* HERO */}
        <section className="hero">
          <motion.div
            className="hero-container"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="hero-text">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                Take your <span className="highlight">knowledge</span> to the next level
              </motion.h1>
              <p className="subtitle">
                We offer the best courses to help you master new skills
              </p>
              <div className="cta-buttons">
                <a href="/Subjects" className="cta-button primary">
                  Choose your best course
                </a>
                <button
                  className="cta-button secondary"
                  onClick={() => {
                    const el = document.getElementById("features-section");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Learn more <FaArrowRight />
                </button>
              </div>
            </div>
            <motion.div
              className="hero-image"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <img src={logo} alt="Person learning" />
            </motion.div>
          </motion.div>
        </section>

        {/* FEATURES */}
        <section className="features-section" id="features-section">
          {[
            {
              title: "Smart Summaries",
              description: "Our AI reads and understands your course materials to automatically produce summaries that are clear, concise, and easy to retain. These summaries highlight only the essential information, reducing your reading time while helping you focus on what truly matters. They are ideal for quick revisions or as an initial overview before deeper study.",
              img: summaryImg,
            },
            {
              title: "Smart Revision Plan",
              description: "Using adaptive algorithms, the revision planner builds a personalized study schedule based on your availability, the importance of each subject, and upcoming deadlines. It intelligently adjusts when sessions are missed and sends timely reminders to keep you on track. The system focuses your time where it’s most needed, allowing you to learn efficiently and stay organized.",
              img: revisionImg,
            },
            {
              title: "Smart Flashcards",
              description: "Our platform generates flashcards powered by AI, designed to enhance long-term memory through spaced repetition. These flashcards include interactive questions and instant feedback, creating an active learning environment. You can visualize your learning progress as you go, and the system adapts based on your performance to reinforce weaker areas more frequently.",
              img: flashcardImg,
            },
            {
              title: "Personalized Courses",
              description: "YnityLearn creates tailored learning paths based on your goals, skills, and study preferences. The AI recommends the most relevant chapters, adjusts content difficulty, and suggests targeted resources. This customization helps you avoid wasting time on unnecessary content and focus instead on areas that bring real improvement, making your learning experience more effective and motivating..",
              img: courseImg,
            },
            {
              title: "Progress Tracking",
              description: "With dynamic dashboards, you can visualize your learning journey through detailed charts and statistics. The system tracks your scores, study time, and activity over time, giving you clear insights into your strengths and areas for improvement. This feedback loop encourages consistency, helps set goals, and supports better decision-making as you advance.",
              img: progressImg,
            },
            {
              title: "Smart Resources",
              description: "Access intelligent resources optimized by AI to support your understanding and retention. These include enhanced visuals, curated explanations, contextual diagrams, and quizzes tailored to your learning level. By providing the right resource at the right time, the system helps deepen your comprehension and keeps you engaged with the material..",
              img: aiImg,
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              className="feature-block"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <div className="feature-image-container">
                <img src={feature.img} alt={feature.title} className="feature-image" />
              </div>
              <div className="feature-content">
                <h2>{feature.title}</h2>
                <p>{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </section>

        {/* ABOUT SECTION */}
        <section className="about-section">
          <motion.div
            className="about-content"
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2>A Revolution in Learning</h2>
            <p>
              YnityLearn combines cutting-edge technology with sound pedagogy to deliver a truly modern learning experience. The platform adapts to your pace, personalizes your content, and supports you with intelligent feedback and motivation. Whether you're preparing for exams or exploring new knowledge, it guides you every step of the way — making learning more efficient, enjoyable, and empowering.
            </p>
          </motion.div>
          <motion.div
            className="about-image"
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <img src={learningImg} alt="Innovative learning" />
          </motion.div>
        </section>

        {/* TEAM SECTION */}
        <section className="team-section" id="team-section">
          <motion.div
            className="team-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="team-title">Meet Our Team</h2>
            <div className="team-subtitle-container">
              <p className="team-subtitle-line">Ynity Team – Yosr & Nourhene united to</p>
              <p className="team-subtitle-line">code, innovate, and push the limits.</p>
              <p className="team-subtitle-vision">One mind, one vision:</p>
              <p className="team-subtitle-highlight">excellence through harmony.</p>
            </div>
          </motion.div>
          <div className="team-grid-circle">
            {[{
              name: "Yosr Joulek",
              role: "Software Developer",
              description: "A creative mind behind YnityLearn, Yosr brings innovative thinking and a deep passion for education. Her leadership and design vision shape a user-friendly learning experience for all.\n🔸 Educational strategist • UI/UX visionary • Co-founder of YnityLearn",
              img: teamMember1,
              },
              {
                name: "Nourhene Abbes",
                role: "Software Developer",
                description: "An AI-driven developer, Nourhene is the architect of YnityLearn’s intelligent features. From flashcard generation to real-time coaching, she powers the AI that personalizes every student's journey.\n🔸 AI expert • Backend & logic engineer • Co-founder of YnityLearn",
                img: teamMember2,
              },
              {
                name: "Hounaida Moalla ",
                role: "Associate Professor",
                description: "Expert in Computer Systems, specialized in AI (Machine Learning, Deep Learning, Generative AI). Certified in Java, Python (Microsoft), Deep Learning & Generative AI (NVIDIA), and ML (CDOSS). Currently leading research on AI applications in cardiology, including stenosis detection using deep learning and generative models.",
                img: teamMember3,
              },
            ].map((member, idx) => (
              <motion.div
                key={idx}
                className="team-card-circle"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                whileHover={{ y: -10, boxShadow: "0 15px 25px rgba(0, 0, 0, 0.15)" }}
              >
                <div className="team-image-circle-container">
                  <img src={member.img} alt={member.name} className="team-image-circle" />
                </div>
                <div className="team-content-circle">
                  <h3>{member.name}</h3>
                  <p className="team-role-circle">{member.role}</p>
                  <p className="team-description-circle">{member.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default Home;