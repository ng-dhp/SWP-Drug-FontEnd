import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/FeedbackForm.css";

export default function FeedbackForm() {
  const [userId, setUserId] = useState(null);
  const [consultants, setConsultants] = useState([]);
  const [selectedConsultantId, setSelectedConsultantId] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // ✅ Dùng để quay lại trang chủ

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/v1.0/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUserId(data.userId);
        } else {
          console.error("❌ Không thể lấy userId");
        }
      } catch (err) {
        console.error("❌ Lỗi fetch userId:", err);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/v1.0/consultant/getAllConsultant", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setConsultants(data);
        } else {
          const errText = await res.text();
          console.error("❌ Không thể lấy danh sách tư vấn viên:", errText);
        }
      } catch (err) {
        console.error("❌ Lỗi fetch consultants:", err);
      }
    };

    fetchConsultants();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId || !selectedConsultantId || !content.trim()) {
      setMessage("⚠️ Vui lòng điền đầy đủ thông tin.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/v1.0/feedback/consultant/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          content,
          userId,
          consultantId: Number(selectedConsultantId),
        }),
      });

      if (res.ok) {
        setMessage("✅ Gửi phản hồi thành công!");
        setContent("");
        setSelectedConsultantId("");
      } else {
        const error = await res.text();
        console.error("❌ Lỗi khi gửi feedback:", error);
        setMessage("❌ Gửi phản hồi thất bại.");
      }
    } catch (err) {
      console.error("❌ Lỗi hệ thống khi gửi feedback:", err);
      setMessage("❌ Có lỗi xảy ra khi gửi phản hồi.");
    }
  };

  return (
    <div className="feedback-form-container">
      <h2>Gửi phản hồi cho tư vấn viên</h2>
      <form onSubmit={handleSubmit} className="feedback-form">
        <label>
          Chọn tư vấn viên:
          <select
            value={selectedConsultantId}
            onChange={(e) => setSelectedConsultantId(e.target.value)}
            required
          >
            <option value="">-- Chọn --</option>
            {consultants.map((c) => (
              <option key={c.consultantId} value={String(c.consultantId)}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Nội dung phản hồi:
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Viết nội dung phản hồi tại đây..."
            required
          />
        </label>

        <button type="submit">Gửi phản hồi</button>
      </form>

      {message && <p className="feedback-message">{message}</p>}

      <div className="BACK">
        <button onClick={() => navigate("/")}>🏠 Quay lại trang chủ</button>
      </div>
    </div>
  );
}
