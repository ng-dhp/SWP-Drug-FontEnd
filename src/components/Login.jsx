import React, { useState } from "react";
import "./cssCom/Login.css";

export default function LoginModal({ onClose }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const handleGoogleLogin = () => {
    console.log("Đang đăng nhập bằng Google...");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch("https://your-api-url.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Đăng nhập thành công:", data);
        // TODO: lưu token nếu có, chuyển hướng, đóng modal, v.v.
        onClose();
      } else {
        alert(data.message || "Đăng nhập thất bại");
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
            type="text"
            placeholder="Username"
            className="form-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
