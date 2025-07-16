import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHeartbeat, FaUserMd, FaSchool, FaUsers } from "react-icons/fa";
import Navbar from "./components/navbar";
import LoginModal from "./components/Login";
import RegisterModal from "./components/Register";
import "./AppContent.css";
import hinh1 from "./assets/hinhmt1.jpg";
import hinh2 from "./assets/hinhmt2.jpg";
import hinh3 from "./assets/hinhmt3.jpg";

function AppContent() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 7000); // 7 giây để xem ảnh rõ ràng hơn

    return () => clearInterval(interval);
  }, []);

  const backgroundImages = [hinh1, hinh2, hinh3];
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    navigate("/"); // quay về trang chính
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
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
          <p className="hero-description">
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
      <section className="slideshow-wrapper">
        <div
          className="slideshow-track"
          style={{ transform: `translateX(-${currentIndex * 100}vw)` }}
        >
          {backgroundImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Slide ${index}`}
              className="slideshow-img"
            />
          ))}
          {/* duplicate for seamless scroll */}
          {backgroundImages.map((img, index) => (
            <img
              key={`dup-${index}`}
              src={img}
              alt={`Slide dup ${index}`}
              className="slideshow-img"
            />
          ))}
        </div>
      </section>

      <section class="service-section">
        <div className="hero-tag">⚡ Dịch vụ Chuyên nghiệp</div>

        <div class="service-header">
          <h2>
            Dịch vụ <strong>Hỗ trợ</strong> <br />
            Phòng ngừa <strong>Ma túy</strong>
          </h2>
          <p>
            Chúng tôi cung cấp các dịch vụ toàn diện để hỗ trợ cộng đồng trong
            việc phòng ngừa và giáo dục về tác hại của ma túy
          </p>
        </div>

        <div class="service-grid">
          <div class="service-card service-blue">
            <div className="icon-wrapper">📘</div>
            <h4> Khóa học Trực tuyến</h4>
            <p className="service-subtitle">
              Các khóa đào tạo về nhận thức ma túy, kỹ năng phòng tránh và từ
              chối
            </p>
            <li>Nội dung phân theo độ tuổi</li>
            <li>Học sinh, sinh viên, phụ huynh</li>
            <li>Giáo viên và người làm việc với trẻ</li>
            <li>Chứng chỉ hoàn thành</li>

            <Link to="/khoahoc" className="learn-more-btn">
              Tìm hiểu thêm →
            </Link>
          </div>

          <div class="service-card service-green">
            <div className="icon-wrapper">🧪</div>
            <h4>Đánh giá Rủi ro</h4>
            <p className="service-subtitle">
              Khảo sát trắc nghiệm ASSIST, CRAFFT để xác định mức độ nguy cơ
            </p>
            <li>Bài khảo sát ASSIST</li>
            <li>Bài khảo sát CRAFFT</li>
            <li>Đề xuất hành động phù hợp</li>
            <li>Kết quả nhanh chóng</li>

            <Link to="/khaosat" className="learn-more-btn">
              Tìm hiểu thêm →
            </Link>
          </div>

          <div class="service-card service-purple">
            <div className="icon-wrapper">💬</div>
            <h4> Tư vấn Chuyên viên</h4>
            <p className="service-subtitle">
              Đặt lịch hẹn trực tuyến với chuyên viên tư vấn có kinh nghiệm
            </p>
            <li>Chuyên viên có bằng cấp</li>
            <li>Đặt lịch linh hoạt</li>
            <li>Tư vấn chuyên nghiệp</li>
            <li>Hỗ trợ 24/7</li>

            <Link to="/tuvan" className="learn-more-btn">
              Tìm hiểu thêm →
            </Link>
          </div>

          <div class="service-card service-yellow">
            <div className="icon-wrapper">🌍</div>
            <h4>Chương trình Cộng đồng</h4>
            <p className="service-subtitle">
              Quản lý các chương trình truyền thông và giáo dục cộng đồng
            </p>
            <li>Chương trình giáo dục</li>
            <li>Hoạt động cộng đồng</li>
            <li>Khảo sát trước/sau</li>
            <li>Đánh giá hiệu quả</li>

            <Link to="/Chiendich" className="learn-more-btn">
              Tìm hiểu thêm →
            </Link>
          </div>
        </div>

        <div className="highlight-wrapper">
          <div className="highlight-item">
            <div className="highlight-icon blue">⏰</div>
            <h3>Hỗ trợ 24/7</h3>
            <p>Luôn sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi</p>
          </div>

          <div className="highlight-item">
            <div className="highlight-icon green">🎓</div>
            <h3>Chuyên viên Có kinh nghiệm</h3>
            <p>Đội ngũ chuyên viên được đào tạo bài bản</p>
          </div>

          <div className="highlight-item">
            <div className="highlight-icon purple">👥</div>
            <h3>Cộng đồng Hỗ trợ</h3>
            <p>Kết nối với cộng đồng những người cùng chung mục tiêu</p>
          </div>
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
