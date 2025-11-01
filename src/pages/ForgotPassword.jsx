import React, { useState } from "react";
import { motion } from "framer-motion";
import backgroundImage from "../assets/auth-bg-5.jpg";
import logo from "../assets/logo_2_sans_bg.png";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ text: "📧 Un email de réinitialisation a été envoyé !", type: "success" });
      } else {
        setMessage({ text: data.message || "❌ Une erreur est survenue", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "❌ Erreur réseau", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.fullscreenBackground} />
      <div style={styles.overlay} />
      <motion.div
        style={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div style={styles.authCard}>
          <img src={logo} alt="YnityLearn Logo" style={styles.logo} />
          <h2 style={styles.title}>Forgot your password?</h2>
          
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label htmlFor="email" style={styles.label}>Email address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            <motion.button
              type="submit"
              style={styles.loginButton}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "SEND RESET LINK"}
            </motion.button>
          </form>

          {message && (
            <div style={{
              ...styles.message,
              color: message.type === "success" ? "#4BB543" : "#FF3333"
            }}>
              {message.text}
            </div>
          )}

          <p style={styles.backLink}>
            <a href="/login" style={styles.linkText}>← Back to login page</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// Styles cohérents avec votre page Login
const styles = {
  container: {
    position: "relative",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Poppins', sans-serif",
    overflow: "hidden",
    marginTop: "-60px",
  },
  fullscreenBackground: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    zIndex: 0,
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: 1,
  },
  content: {
    position: "relative",
    zIndex: 2,
    width: "800px",
    maxWidth: "500px",
    padding: "0 20px",
  },
  authCard: {
    backdropFilter: "blur(10px)",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "16px",
    padding: "40px",
    boxShadow: "0 15px 30px rgba(0, 0, 0, 0.15)",
    border: "1px solid rgba(255, 255, 255, 0.4)",
    textAlign: "center",
  },
  logo: {
    width: "200px",
    height: "150px",
    margin: "0 auto 20px",
    display: "block",
    marginTop: "-20px",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: 700,
    color: "#000000",
    marginTop: "-20px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    marginTop: "30px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    textAlign: "left",
  },
  label: {
    fontSize: "0.9rem",
    color: "#000000",
    fontWeight: 500,
  },
  input: {
    padding: "14px 16px",
    borderRadius: "10px",
    border: "1px solid #E2E8F0",
    fontSize: "1rem",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    transition: "all 0.2s ease",
  },
  loginButton: {
    background: "linear-gradient(to right, #f76a1e, #8e44ad)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "16px",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "10px",
    width: "100%",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(142, 68, 173, 0.3)",
  },
  message: {
    marginTop: "20px",
    fontSize: "0.9rem",
    fontWeight: 500,
  },
  backLink: {
    marginTop: "25px",
    color: "#000000",
    fontSize: "0.9rem",
  },
  linkText: {
    color: "#f76a1e",
    textDecoration: "none",
    fontWeight: 600,
    transition: "all 0.2s ease",
    ":hover": {
      textDecoration: "underline",
    },
  },
};

export default ForgotPassword;