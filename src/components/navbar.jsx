import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/logo01.png";
import "./cssCom/navbar.css";

export default function Navbar({ onLogin, onRegister, isLoggedIn, onLogout }) {
  const [fullName, setFullName] = useState("");
  const [roleName, setRoleName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Bản dịch role sang tiếng Việt
  const roleMap = {
    Admin: "Quản trị viên",
    User: "Người dùng",
    Consultant: "Tư vấn viên",
    Manager: "Quản lý",
    Staff: "Nhân viên",
  };

  useEffect(() => {
    if (isLoggedIn) {
      const token = localStorage.getItem("token");
      if (!token) {
        onLogout?.();
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
            if (res.status === 401) {
              localStorage.removeItem("token");
              localStorage.removeItem("userEmail");
              onLogout?.();
            }
            throw new Error("Lỗi khi lấy thông tin người dùng");
          }
          return res.json();
        })
        .then((data) => {
          setFullName(data.fullName || data.email || "Người dùng");
          setRoleName(data.roleName || "");
        })
        .catch((err) => console.error("❌ Lỗi lấy profile:", err));
    } else {
      setFullName("");
      setRoleName("");
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

        {/* Menu điều hướng */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="nav-links flex gap-5 items-center">
            <Link to="/">Trang chủ</Link>
            <Link to="/khaosat">Khảo sát</Link>
            <Link to="/tuvan">Tư vấn</Link>
            <Link to="/khoahoc">Khóa học</Link>
            <Link to="/chiendich">Chiến dịch</Link>
            <Link to="/feedbackform">Đánh giá</Link>

            {/* Menu riêng theo role */}
            {roleName === "ADMIN" && (
              <>
                <Link to="/quanly">Quản lý</Link>
                <div
                  className="dropdown"
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <span className="dropdown-toggle cursor-pointer">Dashboard</span>
                  {isDropdownOpen && (
                    <div className="dropdown-menu bg-white shadow-md absolute z-50 p-2 rounded">
                      <Link to="/dashboard-survey">Báo Cáo Khảo Sát</Link>
                      <Link to="/dashboard-campaign">Báo Cáo Chiến Dịch</Link>
                      <Link to="/dashboard-request">Báo Cáo Yêu Cầu</Link>
                      <Link to="/dashboard-feedback">Báo Cáo Phản Hồi</Link>
                    </div>
                  )}
                </div>
              </>
            )}

            {roleName === "STAFF" && (
              <Link to="/xulyyeucau">Xử lý yêu cầu</Link>
            )}

            {roleName === "CONSULTANT" && (
              <Link to="/lichhen">Lịch hẹn</Link>
            )}
          </div>
        </motion.div>

        {/* Auth */}
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
              <Link
                to="/profile"
                className="user-role"
                style={{ alignItems: "center", fontWeight: 500 }}
              >
                Xin chào, {fullName}{" "}
                {roleName && `(${roleMap[roleName] || roleName.toUpperCase()})`}
              </Link>
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
