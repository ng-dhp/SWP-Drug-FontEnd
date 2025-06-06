import React from "react";
import "./cssCom/register.CSS"; // Tái sử dụng hoặc tạo CSS riêng nếu cần

export default function RegisterModal({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Đăng Ký</h2>
        <form>
          <div className="form-group">
            <label>Tên người dùng:</label>
            <input type="text" placeholder="Tên người dùng" required />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" placeholder="Email" required />
          </div>
          <div className="form-group">
            <label>Mật khẩu:</label>
            <input type="password" placeholder="Mật khẩu" required />
          </div>
          <button type="submit">Đăng Ký</button>
        </form>
        <button className="close-button" onClick={onClose}>
          Đóng
        </button>
      </div>
    </div>
  );
}
