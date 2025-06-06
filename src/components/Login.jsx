import React from "react";
import "./cssCom/Login.css"; 

export default function LoginModal({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Đăng nhập</h3>
        <form>
          <input type="text" placeholder="Username" className="form-input" />
          <input type="password" placeholder="Password" className="form-input" />
          <button type="submit" className="login-button">Đăng nhập</button>
        </form>
        <button onClick={onClose} className="close-button">Đóng</button>
      </div>
    </div>
  );
}
