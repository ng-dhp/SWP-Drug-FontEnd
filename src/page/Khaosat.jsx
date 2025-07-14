import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import AssistSurvey from "./AssistSurvey";
import CrafftSurvey from "./CrafftSurvey";
import "./css/Khaosat.css";
import anh_assist from "../assets/anh_assist.png";
import anh_crafft from "../assets/anh_crafft.png";
import Navbar from "../components/navbar";
import LoginModal from "../components/Login";
import Register from "../components/Register"; // ✅ Đổi lại tên đúng




export default function KhaoSat() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);



  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    if (!token) {
      console.warn("❌ Không có token, không thể gọi API.");
      setLoading(false);
      return;
    }

    fetch("http://localhost:8080/api/v1.0/admin/dashboard/getAll-templates", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Lỗi khi lấy dữ liệu khảo sát");
        return res.json();
      })
      .then((data) => {
        setTemplates(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Lỗi khi fetch templates:", err);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("❌ Không có token, không thể gọi API.");
      setLoading(false);
      return;
    }

    fetch("http://localhost:8080/api/v1.0/admin/dashboard/getAll-templates", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Lỗi khi lấy dữ liệu khảo sát");
        return res.json();
      })
      .then((data) => {
        setTemplates(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Lỗi khi fetch templates:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="wrapper">
      <Navbar
        isLoggedIn={isLoggedIn}
        onLogin={() => setShowLoginModal(true)}
        onRegister={() => setShowRegisterModal(true)}
        onLogout={handleLogout}
      />

      <div className="header"></div>

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <div className="Khao-sat">
                {!localStorage.getItem("token") ? (
                  <div className="login-warning">
                    <h2>🔒 Vui lòng đăng nhập để thực hiện khảo sát</h2>
                    <p>Bạn cần đăng nhập để truy cập vào các bài khảo sát đánh giá nguy cơ.</p>
                    <button onClick={() => (window.location.href = "/")}>
                      🔑 Đăng nhập ngay
                    </button>
                  </div>
                ) : loading ? (
                  <p>🔄 Đang tải danh sách khảo sát...</p>
                ) : (
                  <>
                    <h2>Khảo Sát Đánh Giá Nguy Cơ</h2>
                    <p className="intro-text">
                      Chào mừng bạn đến với hệ thống khảo sát đánh giá nguy cơ sử dụng ma túy.
                      Khảo sát này giúp bạn hiểu rõ hơn về mức độ nguy cơ và nhận được những hỗ trợ phù hợp.
                    </p>
                    <p className="note">
                      <i>Thông tin của bạn sẽ được bảo mật và chỉ sử dụng cho mục đích hỗ trợ.</i>
                    </p>

                    <div className="survey-cards">
                      {templates.map((template) => (
                        <div className="survey-card" key={template.templateId}>
                          <img
                            src={
                              template.surveyType === "ASSIST" ? anh_assist : anh_crafft
                            }
                            alt={`Khảo sát ${template.surveyType}`}
                            className="survey-image-top"
                          />
                          <h3>{template.name}</h3>
                          <div className="survey-details">
                            <p className="survey-summary">{template.description}</p>
                            <ul
                              className={`survey-features ${template.surveyType === "ASSIST" ? "blue" : "purple"
                                }`}
                            >
                              <li>Độ tuổi: {template.ageGroup}</li>
                              <li>Giới tính: {template.genderGroup}</li>
                              <li>Mức độ rủi ro: {template.riskLevel}</li>
                            </ul>
                          </div>
                          <Link to={template.surveyType.toLowerCase()}>
                            <button className="start-button">📋 Bắt đầu</button>
                          </Link>
                        </div>
                      ))}

                    </div>
                  </>
                )}
              </div>
            }
          />

          {/* Các route khảo sát */}
          <Route path="assist" element={<AssistSurvey />} />
          <Route path="crafft" element={<CrafftSurvey />} />
        </Routes>
      </main>

      <footer className="footer">
        © 2025 Hệ thống Hỗ trợ Phòng ngừa Sử dụng Ma túy<br />
        <small>
          Thông tin trên trang web này chỉ mang tính chất tham khảo và không thay thế cho tư vấn y tế chuyên nghiệp.
        </small>
      </footer>


      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      {showRegisterModal && (
        <Register onClose={() => setShowRegisterModal(false)} />
      )}

    </div>
  );

}
