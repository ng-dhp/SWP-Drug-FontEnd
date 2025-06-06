import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHeartbeat, FaUserMd, FaSchool, FaUsers } from "react-icons/fa";
import "./App.css";
import KhaoSat from "./page/Khaosat.jsx";
import LoginModal from "./components/Login";
import RegisterModal from "./components/Register"; 

export default function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);


  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              {/* Navbar */}
              <header className="navbar">
                <div className="container">
                  <h1 className="tittle">STOP ADDICTION</h1>
                  <nav className="nav-links">
                    <a href="#">Trang chủ</a>
                    <a href="#">Đánh giá</a>
                    <a href="#">Tư vấn</a>
                    <a href="#">Khóa học</a>
                    <a href="#">Chiến dịch</a>
                    <a href="#">Dashboard</a>
                    <button
                      className="login"
                      onClick={() => setShowLoginModal(true)}
                    >
                      Đăng Nhập
                    </button>
                     <button
                      className="Register"
                      onClick={() => setShowRegisterModal(true)}
                    >
                      Đăng Ký
                    </button>
                  </nav>
                </div>
              </header>

              {/* Hero Section */}
              <section className="hero">
                <div className="container hero-content">
                  <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <h2 className="h2-chungtay">
                      Chung tay vì một cộng đồng không chất gây nghiện
                    </h2>
                    <p className="p-nentang">
                      Nền tảng hỗ trợ đánh giá, tư vấn và giáo dục nhằm ngăn ngừa sử dụng chất gây nghiện, đặc biệt ở giới trẻ.
                    </p>
                    <Link to="/khaosat" className="batdau">
                      Bắt đầu đánh giá nguy cơ
                    </Link>
                  </motion.div>
                </div>
              </section>

              <img
                className="anh"
                src="https://i.imgur.com/uOvU87n.jpeg"
                alt="Prevention illustration"
              />

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

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                      {
                        icon: <FaHeartbeat size={32} />,
                        title: "Đánh giá nguy cơ",
                        desc: "Sử dụng ASSIST, CRAFFT để phát hiện sớm.",
                      },
                      {
                        icon: <FaUserMd size={32} />,
                        title: "Tư vấn chuyên gia",
                        desc: "Kết nối với bác sĩ và chuyên gia tâm lý.",
                      },
                      {
                        icon: <FaSchool size={32} />,
                        title: "Khóa học phòng ngừa",
                        desc: "Học theo độ tuổi, nội dung sinh động dễ tiếp thu.",
                      },
                      {
                        icon: <FaUsers size={32} />,
                        title: "Chương trình cộng đồng",
                        desc: "Lan tỏa nhận thức qua chiến dịch, truyền thông.",
                      },
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

              {/* Footer */}
              <footer className="bg-gray-100 py-4 text-center">
                <p>&copy; 2025 Tổ chức Phòng chống Sử dụng Chất Gây Nghiện</p>
                <div className="space-x-4 mt-4">
                  <a href="https://www.facebook.com/duyminecry">Facebook</a>
                  <a href="#">YouTube</a>
                  <a href="#">Liên hệ</a>
                </div>
              </footer>

              {/* Modal Login */}
              {showLoginModal && (
                <LoginModal onClose={() => setShowLoginModal(false)} />
              )}
                 {/* Modal Register */}
              {showRegisterModal && (
                <RegisterModal onClose={() => setShowRegisterModal(false)} />
              )}
            </div>
          }
        />

        <Route path="/khaosat" element={<KhaoSat />} />
      </Routes>
    </Router>
  );
}
