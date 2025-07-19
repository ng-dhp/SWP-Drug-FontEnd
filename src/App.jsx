import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import KhaoSat from "./page/Khaosat";
import TuVan from "./page/tuvan";
import AppContent from "./appContent";
import KhoaHoc from "./page/Khoahoc.jsx"; // 
import ChienDich from "./page/ChienDich";
import Chiendich01 from "./page/Chiendich01.jsx"; //
import Chiendich02 from "./page/Chiendich02.jsx";
import PaymentProcess from "./page/PaymentProcess";
import QuanLyKhoaHoc from "./page/Quanlykhoahoc.jsx";
import SurveyTemplateManager  from "./page/SurveyTemplateManager.jsx"; // Quản lý khảo sát



import Lichhen from "./page/Lichhen";


import DashboardSurvey from "./page/DashBoardSurvey";
import DashboardChienDich from "./page/DashBoardChienDich";
import FeedbackForm from "./page/FeedbackForm.jsx";
import Profile from "./components/profile.jsx"; //
import Navbar from "./components/navbar"; // 
import QuanLy from "./components/quanly.jsx"; // Quản lý người dùng
import XuLyYeuCau from "./components/xulyyeucau.jsx"; // Xử lý yêu cầu
import DashboardYeuCau from "./page/DashBoardYeuCau.jsx"; // ✅
import DashBoardFeedback from "./page/DashBoardFeedback.jsx";
import GuiYeuCau from "./page/guiyeucau.jsx";
import GuiYeuCauCrafft from "./page/guiyeucaucrafft.jsx";
import Diemdanh from "./page/Diemdanh.jsx";
import YeucauThanhToan from "./page/yeucauthanhtoan.jsx";
import QuanLyChiendich from "./page/Quanlychiendich.jsx";








export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/khaosat/*" element={<KhaoSat />} />
        <Route path="/tuvan" element={<TuVan />} />
        <Route path="/chiendich" element={<ChienDich />} />
        <Route path="/chiendich01" element={<Chiendich01 />} />
        <Route path="/chiendich02" element={<Chiendich02 />} />
        <Route path="/payment-process" element={<PaymentProcess />} />


        <Route path="/khoahoc" element={<KhoaHoc />} />

        <Route path="/dashboard-survey" element={<DashboardSurvey />} />
        <Route path="/dashboard-campaign" element={<DashboardChienDich />} />
        <Route path="/dashboard-request" element={<DashboardYeuCau />} />
        <Route path="/dashboard-feedback" element={<DashBoardFeedback />} />
        <Route path="/diemdanh" element={<Diemdanh />} />

        <Route path="/feedbackform" element={<FeedbackForm />}></Route>
        <Route path="/profile" element={<Profile />} />
        <Route path="/quanly" element={<QuanLy />} />
        <Route path="/quanlykhoahoc" element={<QuanLyKhoaHoc />} />
        <Route path="/quanlykhaosat" element={<SurveyTemplateManager />} />
        <Route path="/quanlychiendich" element={<QuanLyChiendich />} />

        <Route path="/xulyyeucau" element={<XuLyYeuCau />} />
        <Route path="/yeucauthanhtoan" element={<YeucauThanhToan />} />

        <Route path="/guiyeucau" element={<GuiYeuCau />} />
        <Route path="/lichhen" element={<Lichhen />} />


        <Route path="/guiyeucaucrafft" element={<GuiYeuCauCrafft />} />




      </Routes>
    </Router>
  );
}