import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import KhaoSat from "./page/Khaosat";
import TuVan from "./page/tuvan";
import AppContent from "./appContent";
import KhoaHoc from "./page/Khoahoc.jsx"; // 
import ChienDich from "./page/ChienDich";
import Chiendich01 from "./page/Chiendich01.jsx"; //

import Lichhen from "./page/Lichhen";


import DashboardSurvey from "./page/DashBoardSurvey";
import DashboardChienDich from "./page/DashBoardChienDich";
import FeedbackForm from "./page/FeedbackForm.jsx";
import Profile from "./components/profile.jsx"; //
import Navbar from "./components/navbar"; // 
import QuanLy from "./components/quanly.jsx"; // Quản lý người dùng
import XuLyYeuCau from "./components/xulyyeucau.jsx"; // Xử lý yêu cầu
import DashboardYeuCau from "./page/DashBoardYeuCau.jsx"; // ✅
import GuiYeuCau from "./page/guiyeucau.jsx";
import GuiYeuCauCrafft from "./page/guiyeucaucrafft.jsx";








export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/khaosat/*" element={<KhaoSat />} />
        <Route path="/tuvan" element={<TuVan />} />
        <Route path="/chiendich" element={<ChienDich />} />
        <Route path="/chiendich01" element={<Chiendich01 />} />

        <Route path="/khoahoc" element={<KhoaHoc />} />
        <Route path="/dashboard-survey" element={<DashboardSurvey />} />
        <Route path="/dashboard-campaign" element={<DashboardChienDich />} />
        <Route path="/dashboard-request" element={<DashboardYeuCau />} />

        <Route path="/feedbackform" element={<FeedbackForm />}></Route>
        <Route path="/profile" element={<Profile />} />
        <Route path="/quanly" element={<QuanLy />} />
        <Route path="/xulyyeucau" element={<XuLyYeuCau />} />
        <Route path="/guiyeucau" element={<GuiYeuCau />} />
          <Route path="/lichhen" element={<Lichhen />} />


        <Route path="/guiyeucaucrafft" element={<GuiYeuCauCrafft />} />




      </Routes>
    </Router>
  );
}