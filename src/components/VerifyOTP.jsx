import React, { useState } from "react";
import "./cssCom/OTPModal.css";

export default function OTPModal({ email, onVerify, onClose }) {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleResetPassword = async () => {
    setError("");
    setSuccess("");

    if (!otp.trim() || !newPassword.trim()) {
      setError("Vui lòng nhập đầy đủ OTP và mật khẩu mới");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/v1.0/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      if (response.ok) {
        setSuccess("Đặt lại mật khẩu thành công!");
        onVerify();
      } else {
        // Kiểm tra nếu có body trả về mới parse
        const text = await response.text();
        const data = text ? JSON.parse(text) : {};
        setError(data.message || "Đặt lại mật khẩu thất bại");
      }
    } catch (err) {
      console.error("Lỗi khi đặt lại mật khẩu:", err);
    }
  };


  return (
    <div className="otp-backdrop">
      <div className="otp-modal">
        <h3>Đặt lại mật khẩu bằng OTP</h3>
        <p>
          Mã OTP đã được gửi đến email: <strong>{email}</strong>
        </p>

        <input
          type="text"
          placeholder="Nhập mã OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <input
          type="password"
          placeholder="Nhập mật khẩu mới"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        {error && <p className="otp-error">{error}</p>}
        {success && <p className="otp-success">{success}</p>}

        <div className="otp-buttons">
          <button className="verify-btn" onClick={handleResetPassword}>
            Đặt lại mật khẩu
          </button>
          <button className="close-btn" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
