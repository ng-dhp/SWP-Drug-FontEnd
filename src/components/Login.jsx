import React, { useState } from "react";
import ForgetPass from "./ForgetPass";
import Register from "./Register"; // ✅ import Register
import "./cssCom/Login.css";

export default function LoginModal({ onClose, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgetPass, setShowForgetPass] = useState(false);
  const [showRegister, setShowRegister] = useState(false); // ✅ state mở đăng ký

  const handleGoogleLogin = () => {
    console.log("Đang đăng nhập bằng Google...");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/v1.0/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userEmail", data.email);
        onLoginSuccess?.();
        onClose();
      } else {
        alert(data.message || "Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu.");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      alert("Có lỗi xảy ra khi kết nối đến server.");
    }
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>Đăng nhập</h3>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="login-button">Đăng nhập</button>
          </form>

          <div className="forgot-password-container">
            <button
              type="button"
              className="forgot-password-button"
              onClick={() => setShowForgetPass(true)}
            >
              Quên mật khẩu?
            </button>
          </div>

          <div className="register-container">
            <p>Chưa có tài khoản?</p>
            <button
              type="button"
              className="register-button"
              onClick={() => setShowRegister(true)} // ✅ mở modal đăng ký
            >
              Đăng ký
            </button>
          </div>

          <div className="google-login-container">
            <button onClick={handleGoogleLogin} className="google-login-button">
              <img
                src="https://loodibee.com/wp-content/uploads/Google-Logo.png"
                alt="Google logo"
                className="google-logo"
              />
              <span style={{ marginLeft: "8px", fontWeight: "bold" }}>Google đang phát triển</span>
            </button>
          </div>

          <button onClick={onClose} className="close-button">Đóng</button>
        </div>
      </div>

      {/* ✅ Modal Quên mật khẩu */}
      {showForgetPass && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ForgetPass onClose={() => setShowForgetPass(false)} />
          </div>
        </div>
      )}

      {/* ✅ Modal Đăng ký */}
      {showRegister && (
        <div className="modal-overlay">
          <div className="modal-content">
            <Register onClose={() => setShowRegister(false)} />
          </div>
        </div>
      )}
    </>
  );
}
