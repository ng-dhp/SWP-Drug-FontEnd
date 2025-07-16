import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CreateCampaign from "./CreateCampaign";
import "./css/ChienDich.css";
import Navbar from "../components/navbar";
import LoginModal from "../components/Login";
import Register from "../components/Register";

const ChienDich = () => {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [roleName, setRoleName] = useState(""); // 🆕 Thêm state role
  const [isCreateVisible, setIsCreateVisible] = useState(false); // 🆕 Modal tạo chiến dịch

  const handleLoginSuccess = async () => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
    await fetchUserProfile(); // Gọi luôn sau login
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    setRoleName(""); // reset role
    window.location.href = "/";
  };

  // 🆕 Gọi API lấy role
  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:8080/api/v1.0/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRoleName(data.roleName); // ví dụ: "STAFF", "MANAGER", "USER"
    } catch (err) {
      console.error("Lỗi lấy thông tin người dùng:", err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserProfile();
    }
  }, [isLoggedIn]);

  const checkAndJoin = async (campaignId, routePath) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn chưa đăng nhập!");
      return;
    }

    try {
      const profileRes = await fetch("http://localhost:8080/api/v1.0/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const profileData = await profileRes.json();
      const userId = profileData.userId;

      const statusRes = await fetch(
        `http://localhost:8080/api/v1.0/campaigns/${campaignId}/status?userId=${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const statusData = await statusRes.json();

      if (statusData.status === "COMPLETED") {
        alert("Bạn đã tham gia chiến dịch này rồi!");
        return;
      }

      navigate(routePath);
    } catch (err) {
      console.error("Lỗi khi kiểm tra trạng thái:", err);
      alert("Không thể kiểm tra trạng thái. Vui lòng thử lại.");
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

        {/* ✅ Hiển thị nút tạo nếu là Staff hoặc Manager */}
        {["STAFF", "MANAGER"].includes(roleName) && (
          <motion.button
            className="join-button create-button"
            onClick={() => setIsCreateVisible(true)}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ margin: "1rem auto", display: "block" }}
          >
            + Tạo Chiến Dịch
          </motion.button>
        )}

        {/* Danh sách chiến dịch... */}
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
            <button className="join-button" onClick={() => checkAndJoin(1, "/chiendich01")}>
              Tham gia
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
            <button className="join-button" onClick={() => checkAndJoin(2, "/chiendich02")}>
              Tham gia
            </button>
          </motion.div>
        </div>
      </div>

      {/* Modal Tạo chiến dịch */}
      {isCreateVisible && (
        <CreateCampaign onClose={() => setIsCreateVisible(false)} onCreate={() => {}} />
      )}

      {/* Modal đăng nhập */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* Modal đăng ký */}
      {showRegisterModal && (
        <Register onClose={() => setShowRegisterModal(false)} />
      )}
    </>
  );
};

export default ChienDich;
