import React from "react";
import { Link } from "react-router-dom"; // Import Link
import { motion } from "framer-motion";
import logo from "../assets/logo-removebg-preview.png";

export default function Navbar({ onLogin, onRegister }) {
  return (
    <header className="navbar">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/" className="logo-link">
            <img src={logo} alt="Logo" className="logo-image" />
          </Link>
          <nav className="nav-links">
            <Link to="/">Trang chủ</Link>
            <Link to="/khaosat">Đánh giá</Link>
            <Link to="/tuvan">Tư vấn</Link> {/* Chuyển sang dùng Link */}
            <Link to="/khoahoc">Khóa học</Link>
            <Link to="/chiendich">Chiến dịch</Link>
            <Link to="/dashboard">Dashboard</Link>
            <button className="login" onClick={onLogin}>
              Đăng Nhập
            </button>
            <button className="register" onClick={onRegister}>
              Đăng Ký
            </button>
          </nav>
        </motion.div>
      </div>
    </header>
  );
}
