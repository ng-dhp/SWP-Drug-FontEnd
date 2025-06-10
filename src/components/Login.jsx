import React from "react";
import "./cssCom/Login.css"; // Giữ file CSS cũ

export default function LoginModal({ onClose }) {
  const handleGoogleLogin = () => {
    console.log("Đang đăng nhập bằng Google...");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Đăng nhập</h3>
        <form>
          <input type="text" placeholder="Username" className="form-input" />
          <input type="password" placeholder="Password" className="form-input" />
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
