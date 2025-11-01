import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Edit, Lock, Check, X, Camera, User, Mail, Calendar, Key } from "lucide-react";
import axios from "axios";
import "../pages/styles/ProfilePage.css";
import Navbar from "../components/Navbar";

export default function ProfilePageAlt() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    avatar: null
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/user`, {
          withCredentials: true
        });
        setUser(response.data);
        setFormData({
          firstName: response.data.firstName || "",
          lastName: response.data.lastName || "",
          avatar: response.data.avatar || null
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          avatar: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const validatePassword = () => {
    const newErrors = {};
    if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters long.";
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/auth/profile`,
        formData,
        { withCredentials: true }
      );
      setUser(response.data);
      setEditMode(false);
      setSuccess("Profile updated successfully.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrors({ submit: "Error while updating profile." });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        { withCredentials: true }
      );
      setPasswordMode(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setSuccess("Password changed successfully.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error changing password:", error);
      setErrors({ submit: "Incorrect current password or server error." });
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-error">
        <p>You must be logged in to access this page.</p>
        <Link to="/login" className="login-link">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="profile-alt-container">
      <Navbar />
      {/* Header with colored background */}
      <div className="profile-header-alt">
        <div className="header-content">
          <div className="avatar-wrapper">
            {user.avatar ? (
              <img src={user.avatar} alt="Avatar" className="main-avatar" />
            ) : (
              <div className="avatar-fallback">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <h1>
            {formData.firstName || user.firstName} {formData.lastName || user.lastName}
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="profile-main-alt">
        {success && <div className="alert success">{success}</div>}
        {errors.submit && <div className="alert error">{errors.submit}</div>}

        {/* Personal Info Section */}
        <section className="info-section">
          <div className="section-header">
            <h2><User size={20} /> Personal Information</h2>
          </div>

          {editMode ? (
            <form className="edit-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-row">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" className="cancel" onClick={() => setEditMode(false)}>
                  <X size={16} /> Cancel
                </button>
                <button type="submit" className="save">
                  <Check size={16} /> Save
                </button>
              </div>
            </form>
          ) : (
            <div className="info-grid">
              <div className="info-item">
                <Mail size={18} className="info-icon" />
                <div>
                  <h3>Email</h3>
                  <p>{user.email}</p>
                </div>
              </div>
              <div className="info-item">
                <Calendar size={18} className="info-icon" />
                <div>
                  <h3>Member since</h3>
                  <p>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        })
                      : "Unknown date"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Password Section */}
        <section className="password-section">
          <div className="section-header">
            <h2><Key size={20} /> Security</h2>
            {!passwordMode && !editMode && (
              <button
                className="password-btn"
                onClick={() => setPasswordMode(true)}
              >
                <Lock size={16} /> {user.provider === "google" && !user.password ? "Set Password" : "Change Password"}
              </button>
            )}
          </div>

          {passwordMode && (
            <form className="password-form" onSubmit={handlePasswordSubmit}>
              {/* Only show current password if already set */}
              {!(user.provider === "google" && !user.password) && (
                <div className="form-row">
                  <label>Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
              )}

              <div className="form-row">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
                {errors.newPassword && (
                  <span className="form-error">{errors.newPassword}</span>
                )}
              </div>

              <div className="form-row">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
                {errors.confirmPassword && (
                  <span className="form-error">{errors.confirmPassword}</span>
                )}
              </div>

              <div className="form-actions">
                <button type="button" className="cancel" onClick={() => setPasswordMode(false)}>
                  <X size={16} /> Cancel
                </button>
                <button type="submit" className="save">
                  <Check size={16} /> Save
                </button>
              </div>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
