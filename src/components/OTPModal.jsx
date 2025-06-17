import React, { useState } from "react";
import "./cssCom/OTPModal.css";
export default function OTPModal({ email, onVerify, onClose }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleVerify = async () => {
    if (!otp.trim()) {
      setError("Vui lòng nhập mã OTP");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/v1.0/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      if (response.ok) {
        onVerify();
      } else {
        const data = await response.json();
        setError(data.message || "Mã OTP không đúng");
      }
    } catch (err) {
      console.error("Lỗi khi xác thực OTP:", err);
      setError("Lỗi kết nối máy chủ");
    }
  };

  return (
    <div className="otp-backdrop">
      <div className="otp-modal">
        <h3>Xác minh OTP</h3>
        <p>
          Mã OTP đã được gửi đến email:{" "}
          <strong>{email}</strong>
        </p>
        <input
          type="text"
          placeholder="Nhập mã OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        {error && <p className="otp-error">{error}</p>}
        <div className="otp-buttons">
          <button className="verify-btn" onClick={handleVerify}>
            Xác minh
          </button>
          <button className="close-btn" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
