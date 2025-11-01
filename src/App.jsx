import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CreateCourse from "./pages/CreateCourse";
import Flashcards from "./pages/Flashcards";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import MyPlannings from "./pages/MyPlannings";
import PlanningResult from "./pages/PlanningResult";
import Planning from "./pages/Planning";
import Course from "./pages/cours";
import Subjects from "./pages/Subjects";
import Progression from "./pages/Progression";
import ProgressionRevision from "./pages/progressionRevision";
import ProfilePage from "./pages/Profil";
import SettingsPage from "./pages/SettingsPage";
import ExamPage from "./pages/ExamPage";
import ExamResult from "./pages/ExamResult";
import Chatbot from "./pages/Chatbot";
import CourseFullSummary from "./pages/FullSummaryPage";
import AllSummaries from "./pages/AllSummaries";
import MyExams from "./pages/MyExams";
import CourseByTitle from "./pages/CourseByTitle";
import SubjectPlanning from "./pages/SubjectPlanning";
import SubjectProgression from "./pages/SubjectProgression";
import CourseSelection from "./pages/CourseSelection";
import CreateRoomAutoWrapper from "./pages/CreateRoomAutoWrapper";
import LiveLobby from "./pages/LiveLobby";
import LiveGame from "./pages/LiveGame";
import JoinRoomOnlyId from "./pages/JoinRoomOnlyId";
import UsageTracking from "./pages/UsageTracking";
import Features from "./pages/Features";
import APIs from "./pages/APIs";

function App() {
  return (
    <Router>
      <Routes>
        {/* 🚀 Redirection automatique de "/" vers "/home" */}
        <Route path="/" element={<Navigate to="/home" />} />

        {/* Pages publiques */}
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Pages privées */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/subjects/:id/courses" element={<Courses />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course" element={<Course />} />
        <Route path="/courses/create" element={<CreateCourse />} />
        <Route path="/courses/:id/full-summary" element={<CourseFullSummary />} />
        <Route path="/courses/by-title/:title" element={<CourseByTitle />} />

        <Route path="/flashcards/:id" element={<Flashcards />} />
        <Route path="/planning" element={<Planning />} />
        <Route path="/planning/result" element={<PlanningResult />} />
        <Route path="/planning/all" element={<MyPlannings />} />
        <Route path="/planning/subject/:subjectId" element={<SubjectPlanning />} />

        <Route path="/progression/subject/:id" element={<SubjectProgression />} />
        <Route path="/progression" element={<Progression />} />
        <Route path="/progressionRevision" element={<ProgressionRevision />} />

        <Route path="/exam/:id" element={<ExamPage />} />
        <Route path="/exam/:id/result" element={<ExamResult />} />
        <Route path="/my-summaries" element={<AllSummaries />} />
        <Route path="/my-exams" element={<MyExams />} />
        <Route path="/UsageTracking" element={<UsageTracking />} />
        {/* Live Quiz */}
        <Route path="/select-course" element={<CourseSelection />} />
        <Route path="/create-room" element={<CreateRoomAutoWrapper />} />
        <Route path="/join-room" element={<JoinRoomOnlyId />} />
        <Route path="/lobby/:roomId" element={<LiveLobby />} />
        <Route path="/live/:roomId" element={<LiveGame />} />

        {/* Chatbot */}
        <Route path="/chatbot" element={<Chatbot />} />



        <Route path="/features" element={<Features />} />
        <Route path="/api" element={<APIs />} />

      </Routes>
    </Router>
  );
}

export default App;
