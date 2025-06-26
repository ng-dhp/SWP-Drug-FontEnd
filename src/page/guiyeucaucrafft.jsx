import React, { useState } from "react";
import "./css/guiyeucau.css";

function GuiYeuCauCrafft() {
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setMessage("⚠️ Vui lòng nhập lý do.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        `http://localhost:8080/api/v1.0/my-requests/retake-survey?templateId=2&reason=${encodeURIComponent(reason)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      setMessage("✅ Yêu cầu của bạn đã được gửi thành công!");
      setReason("");
    } catch (err) {
      setMessage("❌ Lỗi khi gửi yêu cầu: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="assist-survey-container">
      <div className="survey-box">
        <h2 className="question-title">Gửi yêu cầu làm lại khảo sát CRAFFT</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="label-title">Lý do bạn muốn làm lại khảo sát:</label>
            <textarea
              rows="4"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do tại đây..."
            ></textarea>
          </div>

          <div className="button-group">
            <button className="submit-button" type="submit" disabled={loading}>
              {loading ? "Đang gửi..." : "📨 Gửi yêu cầu"}
            </button>
            <button
              type="button"
              className="submit-button"
              onClick={() => (window.location.href = "/")}
            >
              🏠 Quay lại trang chủ
            </button>
          </div>
        </form>

        {message && (
          <p className={`status-message ${message.includes("✅") ? "success" : "error"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default GuiYeuCauCrafft;
