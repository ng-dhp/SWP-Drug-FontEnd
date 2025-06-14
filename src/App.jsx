import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHeartbeat, FaUserMd, FaSchool, FaUsers } from "react-icons/fa";
import "./App.css";
import KhaoSat from "./page/Khaosat.jsx";
import LoginModal from "./components/Login";
import RegisterModal from "./components/Register";
import Navbar from "./components/navbar.jsx";
import TuVan from "./page/tuvan.jsx";

export default function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  // Thêm state quản lý ảnh và hiệu ứng
  const [currentImage, setCurrentImage] = useState("https://i.imgur.com/uOvU87n.jpeg");
  const [fadeClass, setFadeClass] = useState("fade-in");

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

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              {/* Gọi Navbar */}
              <Navbar
                onLogin={() => setShowLoginModal(true)}
                onRegister={() => setShowRegisterModal(true)}
                isLoggedIn={isLoggedIn}
              />

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

              {/* Ảnh có hiệu ứng fade */}
              <img
                className={`anh ${fadeClass}`}
                src={currentImage}
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

                  <div className="khungtinhnang">
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
                    {[ /* dữ liệu blog */].map((blog, i) => (
                      <motion.div
                        key={i}
                        className="bg-white rounded-2xl p-6 shadow hover:shadow-xl transition"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <h4 className="font-semibold text-lg">{blog.title}</h4>
                        <p className="text-sm mt-2">{blog.desc}</p>
                        <a
                          href={blog.link}
                          className="inline-block mt-4 text-blue-600 hover:underline"
                        >
                          Đọc thêm &rarr;
                        </a>
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

              {/* Modals */}
              {showLoginModal && (
                <LoginModal
                  onClose={() => setShowLoginModal(false)}
                  onLoginSuccess={() => {
                    setIsLoggedIn(true); // 👈 cập nhật trạng thái đã đăng nhập
                    setShowLoginModal(false);
                  }}
                />
              )}
              {showRegisterModal && (
                <RegisterModal onClose={() => setShowRegisterModal(false)} />
              )}
            </div>
          }
        />
        <Route path="/khaosat/*" element={<KhaoSat />} />
        <Route path="/tuvan" element={<TuVan />} />

      </Routes>
    </Router>
  );
}
