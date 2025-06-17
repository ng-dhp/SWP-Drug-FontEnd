
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import KhaoSat from "./page/Khaosat";
import TuVan from "./page/tuvan";
import AppContent from "./appContent";
import KhoaHoc from "./page/Khoahoc.jsx"; // ✅ import file mới

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/khaosat/*" element={<KhaoSat />} />
        <Route path="/tuvan" element={<TuVan />} />


        <Route path="/khoahoc" element={<KhoaHoc />} />

      </Routes>
    </Router>
  );
}
