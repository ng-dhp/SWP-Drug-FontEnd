// AppContent.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHeartbeat, FaUserMd, FaSchool, FaUsers } from "react-icons/fa";
import Navbar from "./components/navbar";
import LoginModal from "./components/Login";
import RegisterModal from "./components/Register";
import "./AppContent.css"; // ✅ Import CSS styles

function AppContent() {
  const navigate = useNavigate();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [currentImage, setCurrentImage] = useState("https://i.imgur.com/uOvU87n.jpeg");
  const [fadeClass, setFadeClass] = useState("fade-in");

  // ✅ Check login state from localStorage when component mounts
  useEffect(() => {
    const storedLogin = localStorage.getItem("isLoggedIn");
    if (storedLogin === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  // ✅ Auto image fade in/out
  useEffect(() => {
    const interval = setInterval(() => {
      setFadeClass("fade-out");
      setTimeout(() => {
        setCurrentImage((prev) =>
          prev === "https://i.imgur.com/uOvU87n.jpeg"
            ? "https://datafiles.nghean.gov.vn/nan-ubnd/2928/quantritintuc/ma-tuy-truong-hoc_01072022638136508723583066.png"
            : "https://i.imgur.com/uOvU87n.jpeg"
        );
        setFadeClass("fade-in");
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
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
      <Navbar
        onLogin={() => setShowLoginModal(true)}
        onRegister={() => setShowRegisterModal(true)}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />

      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h2 className="h2-chungtay">Chung tay vì một cộng đồng không chất gây nghiện</h2>
            <p className="p-nentang">
              Nền tảng hỗ trợ đánh giá, tư vấn và giáo dục nhằm ngăn ngừa sử dụng chất gây nghiện, đặc biệt ở giới trẻ.
            </p>
            <Link to="/khaosat" className="batdau">Bắt đầu đánh giá nguy cơ</Link>
          </motion.div>
        </div>
      </section>

      <img className={`anh ${fadeClass}`} src={currentImage} alt="Prevention illustration" />

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h3
            className="text-3xl font-bold text-center text-blue-800 mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Tính năng nổi bật
          </motion.h3>

          <div className="khungtinhnang">
            {[
              { icon: <FaHeartbeat size={32} />, title: "Đánh giá nguy cơ", desc: "Sử dụng ASSIST, CRAFFT để phát hiện sớm." },
              { icon: <FaUserMd size={32} />, title: "Tư vấn chuyên gia", desc: "Kết nối với bác sĩ và chuyên gia tâm lý." },
              { icon: <FaSchool size={32} />, title: "Khóa học phòng ngừa", desc: "Học theo độ tuổi, nội dung sinh động dễ tiếp thu." },
              { icon: <FaUsers size={32} />, title: "Chương trình cộng đồng", desc: "Lan tỏa nhận thức qua chiến dịch, truyền thông." },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="bg-blue-50 rounded-2xl p-6 shadow hover:shadow-xl hover:scale-105 transition text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div>{item.icon}</div>
                <h4 className="font-semibold mt-2">{item.title}</h4>
                <p className="text-sm mt-1">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
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

          <div className="blog-grid">
            {/* blog items map here */}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-4 text-center">
        <p>&copy; 2025 Tổ chức Phòng chống Sử dụng Chất Gây Nghiện</p>
        <div className="space-x-4 mt-4">
          <a href="https://www.facebook.com/duyminecry">Facebook</a>
          <a href="#">YouTube</a>
          <a href="#">Liên hệ</a>
        </div>
      </footer>

      {/* Modals */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} onLoginSuccess={handleLoginSuccess} />
      )}
      {showRegisterModal && (
        <RegisterModal onClose={() => setShowRegisterModal(false)} />
      )}
    </div>
  );
}

export default AppContent;
