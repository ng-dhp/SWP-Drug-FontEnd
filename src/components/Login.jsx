import React, { useState } from "react";
import "./cssCom/Login.css";

export default function LoginModal({ onClose, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleLogin = () => {
    console.log("Đang đăng nhập bằng Google...");
    // Implement Google OAuth2 login if needed
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/v1.0/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }), // Adjust if backend expects 'username'
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Đăng nhập thành công:", data);

        // Store token and email in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("userEmail", data.email);

        // Gọi hàm callback khi đăng nhập thành công
        onLoginSuccess?.(); // Gọi nếu được truyền vào

        onClose(); // Đóng modal
      } else {
        console.error("Đăng nhập thất bại:", data.message);
        alert(data.message || "Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu.");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      alert("Có lỗi xảy ra khi kết nối đến server.");
    }
  };

  return (
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

        <div className="google-login-container">
          <button onClick={handleGoogleLogin} className="google-login-button">
            <img
              src="https://loodibee.com/wp-content/uploads/Google-Logo.png"
              alt="Google logo"
              className="google-logo"
            />
          </button>
        </div>

        <button onClick={onClose} className="close-button">Đóng</button>
      </div>
    </div>
  );
}