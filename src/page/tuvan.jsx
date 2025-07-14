// TuVan.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/tuvan.css";
import LoginModal from "../components/Login";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css"; // nếu cần đồng hồ


export default function TuVan() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [fullName, setFullName] = useState("");
  const [userId, setUserId] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [consultants, setConsultants] = useState([]);

  const [formData, setFormData] = useState({
    date: "",
    time: "",
  });

  // Lấy thông tin user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:8080/api/v1.0/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFullName(data.fullName || data.email || "Người dùng");
        setUserId(data.userId);
      })
      .catch((err) => console.error("Lỗi lấy profile:", err));
  }, [isLoggedIn]);

  // Lấy danh sách tư vấn viên
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/api/v1.0/consultant/getAllConsultant", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
      .then(async (res) => {
        const text = await res.text();
        try {
          const rawData = JSON.parse(text);
          const filtered = rawData.map((c) => ({
            consultantId: c.consultantId,
            name: c.name,
            email: c.email,
            specialization: c.specialization,
            schedule: c.schedule,
            availability: c.availability,
          }));
          setConsultants(filtered);
        } catch (err) {
          console.error("Lỗi JSON:", err.message);
        }
      })
      .catch((err) => console.error("Lỗi khi gọi API:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) return setShowLoginModal(true);
    if (!selectedDoctor) return alert("❗ Vui lòng chọn bác sĩ!");
    if (!userId) return alert("❗ Không tìm thấy ID người dùng.");

    const token = localStorage.getItem("token");
    if (!token) return alert("❗ Token không hợp lệ!");

    const payload = {
      userId: userId,
      consultantId: selectedDoctor.consultantId,
      date: formData.date,
      startTime: formData.time,
      message: "",
      status: "Pending",
      location: "Phòng 203 - Tòa B",
    };

    try {
      const res = await fetch("http://localhost:8080/api/v1.0/appointment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      if (res.ok) {
        alert("🎉 Đặt lịch thành công!");
        setFormData({ date: "", time: "" });
        setSelectedDoctor(null);
      } else {
        alert(`❌ Lỗi: ${text}`);
      }
    } catch (err) {
      alert("❌ Lỗi không xác định: " + err.message);
    }
  };

  return (
    <div className="tuvan-container">
      <h2>🩺 Tư Vấn & Đặt Lịch Hẹn</h2>

      {isLoggedIn && (
        <p className="greeting">👋 Xin chào, <strong>{fullName}</strong></p>
      )}

      <p>🧑‍⚕️ Chọn bác sĩ bạn muốn đặt lịch:</p>
      <div className="doctor-list">
        {consultants.map((doctor) => (
          <div
            key={doctor.consultantId}
            className={`doctor-card ${selectedDoctor?.consultantId === doctor.consultantId ? "selected" : ""}`}
            onClick={() => setSelectedDoctor(doctor)}
          >
            <h3>{doctor.name}</h3>
            <p><strong>Chuyên ngành:</strong> {doctor.specialization}</p>
            <p><strong>Email:</strong> {doctor.email}</p>
            <p><strong>Trạng thái:</strong> {doctor.availability ? "🟢 Có sẵn" : "🔴 Không có sẵn"}</p>
          </div>
        ))}
      </div>

      <h3>📅 Đặt Lịch Hẹn</h3>
      <form className="tuvan-form" onSubmit={handleSubmit}>
        <label>
          Ngày hẹn:
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </label>
        <label>
          Giờ hẹn:
          <TimePicker
            name="time"
            onChange={(value) => setFormData((prev) => ({ ...prev, time: value }))}
            value={formData.time}
            format="HH:mm"
            disableClock
            clearIcon={null}
            required
          />
        </label>

        <button type="submit" disabled={!selectedDoctor || !userId}>
          {isLoggedIn ? "📥 Đặt Lịch" : "🔐 Vui lòng đăng nhập"}
        </button>
      </form>

      <button className="back-home-button" onClick={() => navigate("/")}>
        🏠 Về Trang Chủ
      </button>

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={() => {
            setIsLoggedIn(true);
            setShowLoginModal(false);
            alert("✅ Đăng nhập thành công!");
          }}
        />
      )}
    </div>
  );
}
