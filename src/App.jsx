import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import KhaoSat from "./page/Khaosat";
import TuVan from "./page/tuvan";
import AppContent from "./appContent";
import KhoaHoc from "./page/Khoahoc.jsx"; // ✅ import file mới
import ChienDich from "./page/ChienDich";
import Dashboard from "./page/DashBoard";
import DashboardSurvey from "./page/DashBoardSurvey";
import DashboardChienDich from "./page/DashBoardChienDich";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/khaosat/*" element={<KhaoSat />} />
        <Route path="/tuvan" element={<TuVan />} />
        <Route path="/chiendich" element={<ChienDich />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/khoahoc" element={<KhoaHoc />} />
        <Route path="/dashboard-survey" element={<DashboardSurvey />} />
        <Route path="/dashboard-campaign" element={<DashboardChienDich />} />
      </Routes>
    </Router>
  );
}