import React, { useState } from "react";
import "./cssCom/OTPModal.css";
import API_ENDPOINTS from "../APIconfig"; // Gợi ý: dùng chung endpoint

export default function OTPModal({ email, onVerify, onClose }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleVerify = async () => {
    if (!otp.trim()) {
      setError("Vui lòng nhập mã OTP");
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.VERIFY_OTP, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const contentType = response.headers.get("content-type");

      if (response.ok) {
        setError("");
        onVerify();
      } else {
        let message;
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          message = data.message || "Mã OTP không đúng";
        } else {
          message = await response.text(); // xử lý dạng plain text như "Invalid OTP"
        }
        setError(message);
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
          Mã OTP đã được gửi đến email của bạn
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
