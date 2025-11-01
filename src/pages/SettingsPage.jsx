// src/pages/SettingsPage.jsx
import React, { useState, useContext } from "react";
import { ThemeContext } from "../components/ThemeContext";
import { Moon, Sun, LogOut, PlayCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import "../pages/styles/SettingsPage.css";

export default function SettingsPage() {
    const [lang, setLang] = useState("fr");

    const languages = [
        { code: "en", label: "English", flag: "🇬🇧" },
        { code: "fr", label: "Français", flag: "🇫🇷" },
        { code: "ar", label: "العربية", flag: "🇸🇦" },
    ];

    return (
        <>
            <Navbar />

            {/* Zone centrée sous la barre de navigation */}
            <main className="settings-shell">
                <h1 className="settings-heading">
                    <span className="gradient-text">Paramètres</span>
                </h1>

                {/* Langue */}
                <section className="setting-row">
                    <span className="row-label">Langue</span>

                    <div className="pill-group">
                        {languages.map((l) => (
                            <button
                                key={l.code}
                                className={`pill ${lang === l.code ? "active" : ""}`}
                                onClick={() => setLang(l.code)}
                            >
                                {l.flag} {l.label}
                            </button>
                        ))}
                    </div>
                </section>



                {/* Notifications */}
                <section className="setting-row">
                    <span className="row-label">Notifications</span>
                    <div className="notif-toggles">
                        <label className="notif-switch">
                            <input type="checkbox" defaultChecked />
                            <span className="notif-slider"></span>
                        </label>
                    </div>
                </section>

            </main>
        </>
    );
}
