import React, { useState } from "react";

export default function VerifyOTP({ email, onClose, onVerified }) {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      setIsVerifying(true);
      const response = await fetch("http://localhost:8080/api/v1.0/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Xác minh thành công!");

        // ✅ Gọi callback mở lại Login
        if (onVerified) onVerified();

        // ✅ Đóng modal này
        if (onClose) onClose();
      } else {
        alert(data.message || "❌ Xác minh thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi xác minh OTP:", error);
      alert("⚠️ Lỗi kết nối máy chủ.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div>
      <h2>Xác minh OTP</h2>
      <p>Email: {email}</p>
      <form onSubmit={handleVerify}>
        <input
          type="text"
          placeholder="Nhập mã OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="form-input"
          required
        />
        <button type="submit" className="login-button" disabled={isVerifying}>
          {isVerifying ? "Đang xác minh..." : "Xác minh"}
        </button>
      </form>
      <button onClick={onClose} className="close-button">Đóng</button>
    </div>
  );
}
