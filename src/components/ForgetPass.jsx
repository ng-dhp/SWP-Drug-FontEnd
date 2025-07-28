import React, { useState } from "react";
import VerifyOTP from "./VerifyOTP";
import API_ENDPOINTS from "../APIconfig"; // ✅ import endpoint config

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
      const url = `${API_ENDPOINTS.SEND_OTP}?email=${encodeURIComponent(email)}`;
      const response = await fetch(url, {
        method: "POST",
      });

      if (response.ok) {
        alert("Mã OTP đã được gửi đến email của bạn.");
        setStep("verify"); // ✅ Chuyển sang giao diện xác minh OTP
      } else {
        let errorMsg = "Không thể gửi mã OTP. Vui lòng thử lại.";
        try {
          const data = await response.json();
          errorMsg = data.message || errorMsg;
        } catch (jsonErr) {
          const text = await response.text(); // fallback nếu không phải JSON
          console.warn("Phản hồi không hợp lệ:", text);
        }
        alert(errorMsg);
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
