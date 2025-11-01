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
        const list = Object.entries(data).map(([subject, message]) => {
          let type = "info";
          if (message.includes("maîtrisée")) type = "success";
          else if (
            message.includes("tentative") &&
            !message.includes("pas encore")
          )
            type = "warning";
          return { subject, message, type };
        });
        setNotifications(list);
      })
      .catch((err) => {
        console.error("❌ Error fetching UI notifications:", err);
      });
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/user`, {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
                <NavLink to="/planning/all">My Schedules</NavLink>
                <NavLink to="/chatbot">Assistant IA</NavLink>
                <NavLink to="/my-summaries">My Summaries</NavLink>
                <NavLink to="/my-exams">My Exams</NavLink>

                <div
                  className="dropdown"
                  onMouseEnter={() => setOpenDropdown("progress")}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <span
                    className={`nav-link dropdown-toggle ${
                      openDropdown === "progress" ? "active" : ""
                    }`}
                  >
                    Progress ▾
                  </span>
                  <div
                    className={`dropdown-menu enhanced ${
                      openDropdown === "progress" ? "visible" : ""
                    }`}
                  >
                    <Link to="/Progression" className="dropdown-item">
                      📘 My Subject Progression
                    </Link>
                    <Link to="/progressionRevision" className="dropdown-item">
                      📈 Revision Progress Tracker
                    </Link>
                  </div>
                </div>

                <div
                  className="dropdown"
                  onMouseEnter={() => setOpenDropdown("live")}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <span className="nav-link dropdown-toggle">
                    Ynity Live ▾
                  </span>
                  <div
                    className={`dropdown-menu ${
                      openDropdown === "live" ? "visible" : ""
                    }`}
                  >
                    <Link to="/select-course" className="dropdown-item">
                      Add Room
                    </Link>
                    <Link to="/join-room" className="dropdown-item">
                      Join Room
                    </Link>
                  </div>
                </div>
              </>
            )}
          </nav>

          <div className="navbar-actions">
            {user && (
              <div
                className="notification-icon"
                onClick={() => setShowNotif(!showNotif)}
              >
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
                    style={{
                      cursor: n.type === "success" ? "default" : "pointer",
                    }}
                    onClick={() => {
                      if (n.type !== "success") {
                        const encoded = encodeURIComponent(n.subject);
                        window.location.href = `/courses/by-title/${encoded}`;
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
              <div
                className="user-profile"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <span className="username">{user.name}</span>
                <div className="avatar-container">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="avatar" />
                  ) : (
                    <div className="avatar-fallback">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
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
              <Link to="/login" className="login-button">
                Login
              </Link>
            )}

            <button
              className={`hamburger ${mobileOpen ? "active" : ""}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </header>

      <aside className={`mobile-drawer ${mobileOpen ? "open" : ""}`}>
        <nav className="mobile-nav">
          <NavLink to="/home">Home</NavLink>
          {user && (
            <>
              <NavLink to="/Progression">Progress Tracker</NavLink>
              <NavLink to="/Subjects">Subjects</NavLink>
              <NavLink to="/planning/all">My Plannings</NavLink>
              <NavLink to="/my-summaries">My Summaries</NavLink>
              <NavLink to="/my-exams">My Exams</NavLink>
              <NavLink to="/progressionRevision">Revision Progress</NavLink>
            </>
          )}
        </nav>

        {user ? (
          <>
            <div className="mobile-user">
              {user.avatar ? (
                <img src={user.avatar} alt="avatar" className="mobile-avatar" />
              ) : (
                <div className="mobile-avatar-fallback">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="mobile-name">{user.name}</p>
                <p className="mobile-email">{user.email}</p>
              </div>
            </div>
            <button className="mobile-logout" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="mobile-cta">
            Login
          </Link>
        )}
      </aside>

      {mobileOpen && (
        <div className="backdrop" onClick={() => setMobileOpen(false)} />
      )}
    </>
  );
}
