import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import backgroundImage from "../assets/auth-bg-5.jpg";
import logo from "../assets/logo_2_sans_bg.png"; // ✅ ton logo importé ici
import { Eye, EyeOff } from "lucide-react";


// ──────────────────────────────────────────────────────────────────────────────
// Login.jsx   – (Connexion ↔ Inscription) dans UNE SEULE PAGE, même design
// ──────────────────────────────────────────────────────────────────────────────

function Login() {
  // Toggle entre login et signup
  const [isSignup, setIsSignup] = useState(false);

  // States communs / spécifiques
  const [fullName, setFullName] = useState("");        // signup only
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // signup only
  const [rememberMe, setRememberMe] = useState(false);   // login only
  const [showPassword, setShowPassword] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignup) {
      if (password !== confirmPassword) {
        alert("Les mots de passe ne correspondent pas.");
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: fullName,
            email,
            password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log("✅ Inscription réussie :", data);
          window.location.href = "/home"; // ou rediriger via React Router
        } else {
          console.error("❌ Erreur inscription :", data.message);
          alert(data.message || "Erreur lors de l’inscription");
        }
      } catch (err) {
        console.error("❌ Erreur réseau :", err);
        alert("Erreur réseau lors de l’inscription");
      }
    } else {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log("✅ Connexion réussie :", data);
          
          window.location.href = "/home";
        } else {
          console.error("❌ Erreur connexion :", data.message);
          alert(data.message || "Erreur lors de la connexion");
        }
      } catch (err) {
        console.error("❌ Erreur réseau :", err);
        alert("Erreur réseau lors de la connexion");
      }
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
          <h2 style={styles.title}>{isSignup ? "Create an account" : "Log in"}</h2>

          <form onSubmit={handleSubmit} style={styles.form}>
           
            {isSignup && (
              <div style={styles.inputGroup}>
                <label htmlFor="fullName" style={styles.label}>Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>
            )}

            {/* Email */}
            <div style={styles.inputGroup}>
              <label htmlFor="email" style={styles.label}>Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            {/* Mot de passe */}
            <div style={styles.inputGroup}>
              <label htmlFor="password" style={styles.label}>Password</label>
              <div style={styles.passwordInputContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.passwordInput}
                  required
                />
                <span
                  style={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
            </div>

            {isSignup && (
              <div style={styles.inputGroup}>
                <label htmlFor="confirmPassword" style={styles.label}>Confirm password</label>
                <div style={styles.passwordInputContainer}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={styles.passwordInput}
                    required
                  />
                  <span
                    style={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                </div>
              </div>
            )}

            {/* Remember + Forgot – login only */}
            {!isSignup && (
              <div style={styles.optionsRow}>
                <div style={styles.rememberMe}>
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={styles.checkbox}
                  />
                  <label htmlFor="remember" style={styles.rememberLabel}>
                    Remember me
                  </label>
                </div>
                <a href="/forgot-password" style={styles.forgotLink}>
                  Forgot password ?
                </a>
              </div>
            )}

            {/* Bouton principal */}
            <motion.button
              type="submit"
              style={styles.loginButton}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSignup ? "Sign up " : "Log In "}
            </motion.button>
          </form>


          {/* Switch mode */}
          <p style={{ marginTop: "20px", color: "#000000" }}>
            {isSignup ? "Already have an account? " : "Don't have an account? "}
            <span
              onClick={() => setIsSignup((prev) => !prev)}
              style={{ color: "#f76a1e", cursor: "pointer", fontWeight: 600 }}
            >
              {isSignup ? "Log In" : "Create an account"}
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// 🔁 Les styles ORIGINAUX sont conservés intacts pour ne PAS changer le design
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
    color: "black",
  },
  optionsRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rememberMe: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  checkbox: {
    width: "16px",
    height: "16px",
    accentColor: "#4285F4",
  },
  rememberLabel: {
    fontSize: "0.9rem",
    color: "#000000",
  },
  forgotLink: {
    fontSize: "0.9rem",
    color: "#000000",
    textDecoration: "none",
  },
  loginButton: {
    background: "linear-gradient(to right, #f76a1e, #8e44ad)", // orange vers violet
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
    boxShadow: "0 4px 15px rgba(142, 68, 173, 0.3)", // violet shadow
  },
  googleButton: {
    backgroundColor: "white",
    color: "#000000",
    border: "1px solid #E2E8F0",
    borderRadius: "10px",
    padding: "16px",
    fontSize: "1rem",
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    width: "100%",
    marginTop: "20px",
  },
  googleIcon: {
    fontSize: "1.2rem",
  },
  googleText: {
    flex: 1,
    textAlign: "center",
    color: "#000000",
  },
  passwordInputContainer: {
    position: 'relative',
  },
  passwordInput: {
    padding: "14px 40px 14px 16px", // Ajoute de l'espace à droite pour l'icône
    borderRadius: "10px",
    border: "1px solid #E2E8F0",
    fontSize: "1rem",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    transition: "all 0.2s ease",
    width: "100%",
    color: "black",
  },
  passwordToggle: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    color: '#6B7280',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
};

export default Login;
