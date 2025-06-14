import React, { useState } from "react";

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
        onVerify(); // callback khi xác thực thành công
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
    <div className="modal-overlay">
      <div className="modal">
        <h3>Xác minh OTP</h3>
        <p>Chúng tôi đã gửi mã OTP tới email: <strong>{email}</strong></p>
        <input
          type="text"
          placeholder="Nhập mã OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <button onClick={handleVerify}>Xác minh</button>
        <button onClick={onClose} className="close-button">Đóng</button>
      </div>
    </div>
  );
}
