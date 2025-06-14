import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/logo-removebg-preview.png";

export default function Navbar({ onLogin, onRegister, isLoggedIn, onLogout, userName }) {
  return (
    <header className="navbar bg-white shadow-sm">
      <div className="container flex justify-between items-center px-4 py-2 mx-auto">
        {/* Logo và animation */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/" className="logo-link flex items-center">
            <img src={logo} alt="Logo" className="logo-image w-32" />
          </Link>
        </motion.div>

        {/* Navigation links */}
        <nav className="nav-links flex items-center space-x-4 text-sm font-medium">
          <Link to="/">Trang chủ</Link>
          <Link to="/khaosat">Đánh giá</Link>
          <Link to="/tuvan">Tư vấn</Link>
          <Link to="/khoahoc">Khóa học</Link>
          <Link to="/chiendich">Chiến dịch</Link>
          <Link to="/dashboard">Dashboard</Link>

          {/* Hiển thị nút đăng nhập / đăng ký hoặc tên người dùng */}
          {!isLoggedIn ? (
            <>
              <button className="login text-blue-600" onClick={onLogin}>
                Đăng Nhập
              </button>
              <button className="register text-green-600" onClick={onRegister}>
                Đăng Ký
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <span className="text-blue-800">Xin chào, {userName || "Người dùng"}</span>
              <button className="logout text-red-500" onClick={onLogout}>
                Đăng xuất
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
