import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHeartbeat, FaUserMd, FaSchool, FaUsers } from "react-icons/fa";
import Navbar from "./components/navbar";
import LoginModal from "./components/Login";
import RegisterModal from "./components/Register";
import "./AppContent.css";

function AppContent() {
  const navigate = useNavigate();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedLogin = localStorage.getItem("isLoggedIn");
    if (storedLogin === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
    setShowLoginModal(false);
  };

  return (
    <div>
      {/* Navbar */}
      <Navbar
        onLogin={() => setShowLoginModal(true)}
        onRegister={() => setShowRegisterModal(true)}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />

      {/* Hero Section (nền xanh + khung tính năng) */}
      <section className="hero">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="hero-tag">
            🌟 Hệ thống hỗ trợ phòng ngừa ma túy hàng đầu
          </div>
          <h2>
            Cùng nhau <span>Phòng ngừa</span> Ma túy
          </h2>
          <p>
            Hệ thống hỗ trợ cộng đồng với các khóa học trực tuyến, đánh giá rủi
            ro, tư vấn chuyên viên và chương trình giáo dục phòng ngừa ma túy
            hiệu quả.
          </p>
          <div className="button-group">
            <Link to="/khaosat" className="batdau">
              Đánh giá rủi ro →
            </Link>
            <Link to="/tuvan" className="batdau">
              ❤️ Liên hệ Tư vấn
            </Link>
          </div>

          {/* Khung tính năng */}
          <div className="khungtinhnang mt-10">
            {[
              {
                icon: <FaSchool size={36} color="#1e40af" />,
                title: "Khóa học Trực tuyến",
                desc: "Nội dung phân theo độ tuổi: học sinh, sinh viên, phụ huynh, giáo viên",
              },
              {
                icon: <FaHeartbeat size={36} color="#1e40af" />,
                title: "Đánh giá Rủi ro",
                desc: "Khảo sát ASSIST, CRAFFT để xác định mức độ nguy cơ sử dụng ma túy",
              },
              {
                icon: <FaUserMd size={36} color="#1e40af" />,
                title: "Tư vấn Chuyên viên",
                desc: "Đặt lịch hẹn trực tuyến với các chuyên viên tư vấn có kinh nghiệm",
              },
              {
                icon: <FaUsers size={36} color="#1e40af" />,
                title: "Giáo dục Cộng đồng",
                desc: "Chương trình truyền thông và giáo dục cộng đồng về ma túy",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="rounded-2xl bg-white p-6 shadow-md hover:shadow-lg transition text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -4 }}
              >
                <div className="mb-3 flex justify-center">{item.icon}</div>
                <h4 className="text-lg font-semibold text-blue-900">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-700 mt-1">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
      <section class="service-section">
        <div class="service-header">
          <h2>
            Dịch vụ <strong>Hỗ trợ</strong> <br />
            Phòng ngừa <strong>Ma túy</strong>
          </h2>
          <p>
            Hệ thống cung cấp giải pháp toàn diện từ giáo dục, đánh giá đến tư
            vấn chuyên sâu nhằm hỗ trợ cộng đồng phòng ngừa ma túy hiệu quả.
          </p>
        </div>

        <div class="service-grid">
          <div class="service-card service-blue">
            <h4>📘 Khóa học Trực tuyến</h4>
            <ul>
              <li>Phân loại theo độ tuổi</li>
              <li>Danh cho học sinh, phụ huynh, giáo viên</li>
              <li>Có cấp chứng chỉ sau khi hoàn thành</li>
            </ul>
            <Link to="/khoahoc">Tìm hiểu thêm →</Link>
          </div>

          <div class="service-card service-green">
            <h4>🧪 Đánh giá Rủi ro</h4>
            <ul>
              <li>Các bộ công cụ như ASSIST, CRAFFT</li>
              <li>Kết quả riêng tư, bảo mật</li>
              <li>Đề xuất phương án can thiệp</li>
            </ul>
             <Link to="/khaosat">Tìm hiểu thêm →</Link>
          </div>

          <div class="service-card service-purple">
            <h4>💬 Tư vấn Chuyên viên</h4>
            <ul>
              <li>Chuyên viên có kinh nghiệm</li>
              <li>Đặt lịch linh hoạt online/offline</li>
              <li>Hỗ trợ 24/7 và tháo gỡ tâm lý</li>
            </ul>
             <Link to="/tuvan">Tìm hiểu thêm →</Link>
          </div>

          <div class="service-card service-yellow">
            <h4>🌍 Chương trình Cộng đồng</h4>
            <ul>
              <li>Giáo dục phòng ngừa tại trường, địa phương</li>
              <li>Đào tạo tuyên truyền viên</li>
              <li>Kết nối mạng lưới qua thiết bị số</li>
            </ul>
            <a href="#">Tìm hiểu thêm →</a>
          </div>
        </div>
      </section>

      {/* Blog chia sẻ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h3
            className="text-3xl font-bold text-center text-blue-800 mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Blog chia sẻ kinh nghiệm
          </motion.h3>

          <div className="blog-grid">{/* Có thể thêm bài viết ở đây */}</div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>&copy; 2025 Tổ chức Phòng chống Sử dụng Chất Gây Nghiện</p>
        <div>
          <a href="https://www.facebook.com/duyminecry">Facebook</a>
          <a href="#">YouTube</a>
          <a href="#">Liên hệ</a>
        </div>
      </footer>

      {/* Login/Register Modals */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      {showRegisterModal && (
        <RegisterModal onClose={() => setShowRegisterModal(false)} />
      )}
    </div>
  );
}

export default AppContent;
