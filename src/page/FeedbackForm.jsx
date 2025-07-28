import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/FeedbackForm.css";
import Navbar from "../components/navbar";
import LoginModal from "../components/Login";
import Register from "../components/Register";
import API_ENDPOINTS from "../APIconfig";

export default function FeedbackForm() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [consultants, setConsultants] = useState([]);
  const [selectedConsultantId, setSelectedConsultantId] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const token = localStorage.getItem("token");

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
    fetchUserId(); // Lấy lại userId sau khi login
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  const fetchUserId = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.PROFILE, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setUserId(data.userId);
      } else {
        console.error("❌ Không thể lấy userId");
      }
    } catch (err) {
      console.error("❌ Lỗi fetch userId:", err);
    }
  };

  useEffect(() => {
    if (token) fetchUserId();
  }, [token]);

  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.ALL_CONSULTANTS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setConsultants(data);
        } else {
          const errText = await res.text();
          console.error("❌ Không thể lấy danh sách tư vấn viên:", errText);
        }
      } catch (err) {
        console.error("❌ Lỗi fetch consultants:", err);
      }
    };

    if (token) fetchConsultants();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId || !selectedConsultantId || !content.trim()) {
      setMessage("⚠️ Vui lòng điền đầy đủ thông tin.");
      return;
    }

    try {
      const res = await fetch(API_ENDPOINTS.FEEDBACK_CONSULTANT_CREATE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content,
          userId,
          consultantId: Number(selectedConsultantId),
        }),
      });

      if (res.ok) {
        setMessage("✅ Gửi phản hồi thành công!");
        setContent("");
        setSelectedConsultantId("");
      } else {
        const error = await res.text();
        console.error("❌ Lỗi khi gửi feedback:", error);
        setMessage("❌ Gửi phản hồi thất bại.");
      }
    } catch (err) {
      console.error("❌ Lỗi hệ thống khi gửi feedback:", err);
      setMessage("❌ Có lỗi xảy ra khi gửi phản hồi.");
    }
  };

  return (
    <>
      {/* ✅ Navbar đầu trang */}
      <Navbar
        isLoggedIn={isLoggedIn}
        onLogin={() => setShowLoginModal(true)}
        onRegister={() => setShowRegisterModal(true)}
        onLogout={handleLogout}
      />

      <div className="feedback-form-container">
        <h2>📬 Gửi phản hồi cho tư vấn viên</h2>

        <form onSubmit={handleSubmit} className="feedback-form">
          <label>
            Chọn tư vấn viên:
            <select
              value={selectedConsultantId}
              onChange={(e) => setSelectedConsultantId(e.target.value)}
              required
            >
              <option value="">-- Chọn --</option>
              {consultants.map((c) => (
                <option key={c.consultantId} value={String(c.consultantId)}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Nội dung phản hồi:
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Viết nội dung phản hồi tại đây..."
              required
            />
          </label>

          <button type="submit" disabled={!isLoggedIn}>
            {isLoggedIn ? "📨 Gửi phản hồi" : "🔐 Vui lòng đăng nhập"}
          </button>
        </form>

        {message && <p className="feedback-message">{message}</p>}
      </div>

      {/* ✅ Modal đăng nhập */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* ✅ Modal đăng ký */}
      {showRegisterModal && (
        <Register onClose={() => setShowRegisterModal(false)} />
      )}
    </>
  );
}
