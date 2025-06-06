// src/components/Navbar.jsx
import React from "react";

export default function Navbar({ onLogin, onRegister }) {
  return (
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
          <button className="login" onClick={onLogin}>
            Đăng Nhập
          </button>
          <button className="register" onClick={onRegister}>
            Đăng Ký
          </button>
        </nav>
      </div>
    </header>
  );
}
