import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import KhaoSat from "./page/Khaosat";
import TuVan from "./page/tuvan";
import AppContent from "./appContent";
import KhoaHoc from "./page/Khoahoc.jsx"; // ✅ import file mới
import ChienDich from "./page/ChienDich";

import DashboardSurvey from "./page/DashBoardSurvey";
import DashboardChienDich from "./page/DashBoardChienDich";
import FeedbackForm from "./page/FeedbackForm.jsx";
import Profile from "./components/profile.jsx"; // ✅ import file mới
import Navbar from "./components/navbar"; // 👈 Thêm Navbar vào App.js


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/khaosat/*" element={<KhaoSat />} />
        <Route path="/tuvan" element={<TuVan />} />
        <Route path="/chiendich" element={<ChienDich />} />
        
        <Route path="/khoahoc" element={<KhoaHoc />} />
        <Route path="/dashboard-survey" element={<DashboardSurvey />} />
        <Route path="/dashboard-campaign" element={<DashboardChienDich />} />
        <Route path="/feedbackform" element={<FeedbackForm/>}></Route>
        <Route path="/profile" element={<Profile />} />

      </Routes>
    </Router>
  );
}