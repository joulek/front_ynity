import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Bell } from "lucide-react";
import logo from "../assets/logo_2_sans_bg.png";
import "./Navbar.css";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notifications/ui`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        const list = Object.entries(data).map(([subject, message]) => ({
          subject,
          message,
          type: message.includes("maîtrisée")
            ? "success"
            : message.includes("tentative") && !message.includes("pas encore")
            ? "warning"
            : "info",
        }));
        setNotifications(list);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/user`, {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const close = (e) => {
      if (!document.querySelector(".notification-icon")?.contains(e.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  useEffect(() => {
    if (mobileOpen) setShowNotif(false);
  }, [mobileOpen]);

  const logout = () =>
    (window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/logout`);

  const NavLink = ({ to, children }) => (
    <a href={to} className="nav-link" onClick={() => setMobileOpen(false)}>
      {children}
    </a>
  );

  return (
    <>
      <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-container">
          <Link to="/home" className="navbar-logo">
            <img src={logo} alt="YnityLearn" />
          </Link>

          <nav className="navbar-links">
            <NavLink to="/home">Home</NavLink>

            {user && (
              <>
                <NavLink to="/Subjects">Subjects</NavLink>

                {/* ✅ My Chapters as its own section */}
                <NavLink to="/my-chapters">My AI Chapters</NavLink>

                {/* ✅ Services DROPDOWN */}
                <div
                  className="nav-item-group"
                  onMouseEnter={() => setOpenDropdown("services")}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <span className={`nav-link ${openDropdown === "services" ? "active" : ""}`}>
                    Services
                  </span>
                  <div className={`dropdown-panel ${openDropdown === "services" ? "show" : ""}`}>
                    <Link to="/planning/all" className="dropdown-item">📅 My Schedules</Link>
                    <Link to="/my-summaries" className="dropdown-item">📝 My Summaries</Link>
                    <Link to="/my-exams" className="dropdown-item">✅ My Exams</Link>
                  </div>
                </div>

                <NavLink to="/chatbot">Assistant IA</NavLink>

                <div
                  className="nav-item-group"
                  onMouseEnter={() => setOpenDropdown("progress")}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <span className={`nav-link ${openDropdown === "progress" ? "active" : ""}`}>
                    Progress
                  </span>
                  <div className={`dropdown-panel ${openDropdown === "progress" ? "show" : ""}`}>
                    <Link to="/Progression" className="dropdown-item">📘 Subject Progress</Link>
                    <Link to="/progressionRevision" className="dropdown-item">📈 Revision Progress</Link>
                  </div>
                </div>

                <div
                  className="nav-item-group"
                  onMouseEnter={() => setOpenDropdown("live")}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <span className={`nav-link ${openDropdown === "live" ? "active" : ""}`}>
                    Ynity Live
                  </span>
                  <div className={`dropdown-panel ${openDropdown === "live" ? "show" : ""}`}>
                    <Link to="/select-course" className="dropdown-item">➕ Add Room</Link>
                    <Link to="/join-room" className="dropdown-item">🎥 Join Room</Link>
                  </div>
                </div>
              </>
            )}
          </nav>

          <div className="navbar-actions">
            {user && (
              <div className="notification-icon" onClick={() => setShowNotif(!showNotif)}>
                <Bell />
                {notifications.length > 0 && (
                  <span className="notif-badge">{notifications.length}</span>
                )}
              </div>
            )}

            {showNotif && notifications.length > 0 && (
              <div className="notif-dropdown">
                <h4>Notifications</h4>
                {notifications.map((n, i) => (
                  <div
                    key={i}
                    className={`notif-item ${n.type}`}
                    onClick={() => {
                      setShowNotif(false);
                      if (n.type !== "success") {
                        window.location.href = `/courses/by-title/${encodeURIComponent(n.subject)}`;
                      }
                    }}
                  >
                    <strong>{n.subject}</strong> — {n.message}
                  </div>
                ))}
              </div>
            )}

            {loading ? (
              <div className="user-skeleton" />
            ) : user ? (
              <div className="user-profile" onClick={() => setShowUserMenu(!showUserMenu)}>
                <span className="username">{user.name}</span>
                <div className="avatar-container">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="avatar" />
                  ) : (
                    <div className="avatar-fallback">{user.name.charAt(0)}</div>
                  )}
                </div>
                {showUserMenu && (
                  <div className="dropdown-menu visible">
                    <Link to="/profile">My Profile</Link>
                    <button onClick={logout}>Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="login-button">Login</Link>
            )}

            <button
              className={`hamburger ${mobileOpen ? "active" : ""}`}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={26} color="#4338ca" /> : <Menu size={26} color="#4338ca" />}
            </button>
          </div>
        </div>
      </header>

      {/* ✅ MOBILE DRAWER */}
      <aside className={`mobile-drawer ${mobileOpen ? "open" : ""}`}>
        {user && (
          <div className="mobile-welcome">
            👋 Hello, <strong>{user.name}</strong>
          </div>
        )}

        <nav className="mobile-nav">
  <NavLink to="/home">Home</NavLink>

  {user && (
    <>
      <NavLink to="/Subjects">Subjects</NavLink>
      <NavLink to="/my-chapters">My AI Chapters</NavLink>
      <NavLink to="/planning/all">My Schedules</NavLink>
      <NavLink to="/my-summaries">My Summaries</NavLink>
      <NavLink to="/my-exams">My Exams</NavLink>
      <NavLink to="/chatbot">Assistant IA</NavLink>
      <NavLink to="/Progression">Subject Progress</NavLink>
      <NavLink to="/progressionRevision">Revision Progress</NavLink>
      <NavLink to="/select-course">Add Room</NavLink>
      <NavLink to="/join-room">Join Room</NavLink>
      <NavLink to="/profile">My Profile</NavLink>
    </>
  )}
</nav>


        {user ? (
          <div className="mobile-footer">
            <div className="mobile-user">
              {user.avatar ? (
                <img src={user.avatar} className="mobile-avatar" />
              ) : (
                <div className="mobile-avatar-fallback">{user.name.charAt(0)}</div>
              )}
              <div>
                <p className="mobile-name">{user.name}</p>
                <p className="mobile-email">{user.email}</p>
              </div>
            </div>
            <button className="mobile-logout" onClick={logout}>Logout</button>
          </div>
        ) : (
          <div className="mobile-footer">
            <Link className="mobile-cta" to="/login">Login</Link>
          </div>
        )}
      </aside>

      {mobileOpen && <div className="backdrop" onClick={() => setMobileOpen(false)} />}
    </>
  );
}
