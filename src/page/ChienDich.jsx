import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import LoginModal from "../components/Login";
import Register from "../components/Register";
import API_ENDPOINTS from "../APIconfig";
import "./css/ChienDich.css";

const ChienDich = () => {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  const checkAndJoin = async (campaignId, routePath) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn chưa đăng nhập!");
      return;
    }

    setLoading(true);

    try {
      // Lấy profile
      const profileRes = await fetch(API_ENDPOINTS.PROFILE, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!profileRes.ok) {
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        handleLogout();
        return;
      }

      const profileData = await profileRes.json();
      const userId = profileData.userId;

      // Lấy danh sách chiến dịch
      const allCampaignRes = await fetch(API_ENDPOINTS.CAMPAIGN_ALL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const campaigns = await allCampaignRes.json();
      const thisCampaign = campaigns.find((c) => c.id === campaignId);

      if (!thisCampaign) {
        alert("Chiến dịch không tồn tại.");
        return;
      }

      if (!thisCampaign.active) {
        alert("Chiến dịch này đã tạm ngưng khảo sát.");
        return;
      }

      // Kiểm tra trạng thái người dùng trong chiến dịch
      const statusRes = await fetch(API_ENDPOINTS.CAMPAIGN_STATUS(campaignId, userId), {
        headers: { Authorization: `Bearer ${token}` },
      });

      const statusData = await statusRes.json();

      if (statusData.status === "COMPLETED") {
        alert("Bạn đã tham gia chiến dịch này rồi!");
        return;
      }

      // Điều hướng nếu đủ điều kiện
      navigate(routePath);
    } catch (err) {
      console.error("Lỗi khi kiểm tra trạng thái:", err);
      alert("Không thể kiểm tra trạng thái. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        onLogin={() => setShowLoginModal(true)}
        onRegister={() => setShowRegisterModal(true)}
        onLogout={handleLogout}
      />

      <div className="event-page">
        <header className="event-header">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Chiến Dịch Tuyên Truyền
          </motion.h1>
        </header>

        <div className="event-container">
          {/* Chiến dịch 1 */}
          <motion.div
            className="event-card"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <img
              src="https://i.imgur.com/uOvU87n.jpeg"
              alt="Chung tay không ma túy"
              className="event-image"
            />
            <h2>Chiến dịch: Chung tay vì cộng đồng không ma túy</h2>
            <p className="event-topic">📌 Chủ đề: Nâng cao nhận thức cộng đồng</p>
            <p className="event-date">📅 Thời gian: 20/06/2025 - 22/06/2025</p>
            <p className="event-time">🕒 Giờ: 08:00 - 16:00 mỗi ngày</p>
            <p className="event-location">📍 Địa điểm: Trung tâm Văn hóa TP. Hà Nội</p>
            <p className="event-host">👤 Người host: Nguyễn Văn A</p>
            <p className="event-description">
              🎯 Mô tả: Các buổi hội thảo, trưng bày, và giao lưu nhằm tăng cường ý thức cộng đồng về tác hại của chất gây nghiện.
            </p>
            <button
              className="join-button"
              disabled={loading}
              onClick={() => checkAndJoin(1, "/chiendich01")}
            >
              {loading ? "Đang kiểm tra..." : "Tham gia"}
            </button>
          </motion.div>

          {/* Chiến dịch 2 */}
          <motion.div
            className="event-card"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <img
              src="https://datafiles.nghean.gov.vn/nan-ubnd/2928/quantritintuc/ma-tuy-truong-hoc_01072022638136508723583066.png"
              alt="Phòng chống ma túy tại trường học"
              className="event-image"
            />
            <h2>Chiến dịch: Phòng chống ma túy tại trường học</h2>
            <p className="event-topic">📌 Chủ đề: Giáo dục học sinh tránh xa ma túy</p>
            <p className="event-date">📅 Thời gian: 25/06/2025 - 27/06/2025</p>
            <p className="event-time">🕒 Giờ: 09:00 - 15:00</p>
            <p className="event-location">📍 Địa điểm: Trường THPT Chuyên Hà Nội - Amsterdam</p>
            <p className="event-host">👤 Người host: Trần Thị B</p>
            <p className="event-description">
              🎯 Mô tả: Buổi nói chuyện chuyên đề kết hợp hoạt động nhóm nhằm nâng cao kỹ năng phòng chống ma túy cho học sinh.
            </p>
            <button
              className="join-button"
              disabled={loading}
              onClick={() => checkAndJoin(2, "/chiendich02")}
            >
              {loading ? "Đang kiểm tra..." : "Tham gia"}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Modal */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} onLoginSuccess={handleLoginSuccess} />
      )}
      {showRegisterModal && <Register onClose={() => setShowRegisterModal(false)} />}
    </>
  );
};

export default ChienDich;
