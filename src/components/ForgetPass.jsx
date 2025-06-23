import React, { useState } from "react";
import VerifyOTP from "./VerifyOTP";

export default function ForgetPass({ onClose }) {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [step, setStep] = useState("send"); // "send" | "verify"

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Vui lòng nhập email.");
      return;
    }

    try {
      setIsSending(true);
      const response = await fetch(`http://localhost:8080/api/v1.0/send-reset-otp?email=${encodeURIComponent(email)}`, {
        method: "POST",
      });

      if (response.ok) {
        alert("Mã OTP đã được gửi đến email của bạn.");
        setStep("verify"); // ✅ Chuyển sang giao diện xác minh OTP
      } else {
        const data = await response.json();
        alert(data.message || "Không thể gửi mã OTP. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi gửi OTP:", error);
      alert("Lỗi kết nối máy chủ.");
    } finally {
      setIsSending(false);
    }
  };

  if (step === "verify") {
    return <VerifyOTP email={email} onClose={onClose} />;
  }

  return (
    <div>
      <h2>Quên mật khẩu</h2>
      <form onSubmit={handleSendOtp}>
        <input
          type="email"
          placeholder="Nhập email đã đăng ký"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-input"
          required
        />
        <button type="submit" className="login-button" disabled={isSending}>
          {isSending ? "Đang gửi..." : "Gửi OTP"}
        </button>
      </form>
      <button onClick={onClose} className="close-button">Đóng</button>
    </div>
  );
}
