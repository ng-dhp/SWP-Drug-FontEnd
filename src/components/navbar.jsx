
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/logo01.png";
import "./cssCom/navbar.css";

export default function Navbar({ onLogin, onRegister, isLoggedIn, onLogout }) {
  const [fullName, setFullName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);


  useEffect(() => {
    if (isLoggedIn) {
      const token = localStorage.getItem("token");
      console.log("🔑 Token hiện tại:", token);

      if (!token) {
        console.log("No token found, skipping profile fetch");
        onLogout?.(); // Trigger logout if token is missing
        return;
      }

      fetch("http://localhost:8080/api/v1.0/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            console.error("Status:", res.status);
            if (res.status === 401) {
              localStorage.removeItem("token");
              localStorage.removeItem("userEmail");
              onLogout?.(); // Clear state and trigger logout
            }
            throw new Error("Lỗi khi lấy thông tin người dùng");
          }
          return res.json();
        })
        .then((data) => {
          console.log("✅ Dữ liệu nhận được:", data);
          setFullName(data.fullName || data.email || "Người dùng");
        })
        .catch((err) => {
          console.error("❌ Lỗi lấy profile:", err);
        });
    } else {
      setFullName(""); // Clear fullName when not logged in
    }
  }, [isLoggedIn, onLogout]);
  return (
    <header className="navbar bg-white shadow-sm">
      <div className="container flex justify-between items-center px-4 py-2 mx-auto">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/" className="logo-link flex items-center">
            <img src={logo} alt="Logo" className="logo-image w-32" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="nav-links">
            <Link to="/">Trang chủ</Link>
            <Link to="/khaosat">Đánh giá</Link>
            <Link to="/tuvan">Tư vấn</Link>
            <Link to="/khoahoc">Khóa học</Link>
            <Link to="/chiendich">Chiến dịch</Link>

            <div
              className="dropdown"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <Link to="/dashboard" className="dropdown-toggle">Dashboard</Link>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/dashboard-survey">Dashboard Survey</Link>
                  <Link to="/dashboard-campaign">Dashboard Chiến dịch</Link>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Đăng nhập / Đăng ký ở bên phải */}
        <div className="auth-buttons flex items-center space-x-3">
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
            <>
              <span className="text-blue-800">
                Xin chào, {fullName || "Người dùng"}
              </span>
              <button className="logout text-red-500" onClick={onLogout}>
                Đăng xuất
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}