import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/tuvan.css";
import LoginModal from "../components/Login";

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
    message: "",
  });

  // Lấy thông tin người dùng
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
      .then((res) => {
        if (!res.ok) throw new Error("Không lấy được profile");
        return res.json();
      })
      .then((data) => {
        setFullName(data.fullName || data.email || "Người dùng");
        setUserId(data.id);
      })
      .catch((err) => {
        console.error("Lỗi lấy profile:", err);
      });
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
        // 1. Phân tích JSON thô và lọc bằng tay
        const rawData = JSON.parse(text);
        console.log("🔍 Dữ liệu gốc từ API:", rawData);

        // 2. Lọc ra chỉ các thuộc tính cần dùng
        const filtered = rawData.map((c) => ({
          consultantId: c.consultantId,
          name: c.name,
          email: c.email,
          specialization: c.specialization,
          schedule: c.schedule,
          availability: c.availability,
        }));

        console.log("✅ Dữ liệu đã lọc:", filtered);
        setConsultants(filtered);
      } catch (err) {
        console.error("❌ JSON không hợp lệ:", err.message);
        console.error("⛔ Nội dung gốc:", text.slice(0, 1000)); // cắt để dễ nhìn
      }
    })
    .catch((err) => {
      console.error("Lỗi khi gọi API:", err);
    });
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

    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    if (!selectedDoctor) {
      alert("❗ Vui lòng chọn bác sĩ trước khi đặt lịch!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Không tìm thấy token. Vui lòng đăng nhập lại.");
      return;
    }

    const payload = {
      date: formData.date,
      time: formData.time + ":00",
      status: "Scheduled",
      location: "Room 204",
      userId: userId,
      consultantId: selectedDoctor.consultantId,
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

      if (!res.ok) throw new Error("❌ Lỗi khi tạo lịch hẹn");

      alert("🎉 Đặt lịch thành công!");
      setFormData({ date: "", time: "", message: "" });
      setSelectedDoctor(null);
    } catch (err) {
      console.error("Lỗi đặt lịch:", err);
      alert("❌ Lỗi: " + err.message);
    }
  };

  return (
    <div className="tuvan-container">
      <h2>Trang Tư Vấn & Đặt Lịch Hẹn</h2>

      {isLoggedIn && (
        <p className="greeting">
          👋 Xin chào, <strong>{fullName}</strong>
        </p>
      )}

      <p>Chọn bác sĩ bạn muốn đặt lịch:</p>
      <div className="doctor-list">
        {consultants.map((doctor) => (
          <div
            key={doctor.consultantId}
            className={`doctor-card ${selectedDoctor?.consultantId === doctor.consultantId ? "selected" : ""}`}
            onClick={() => setSelectedDoctor(doctor)}
          >
            <h3>{doctor.name}</h3>
            <p><strong>Chuyên ngành:</strong> {doctor.specialization}</p>
            <p><strong>Lịch làm việc:</strong> {doctor.schedule}</p>
            <p><strong>Email:</strong> {doctor.email}</p>
            <p><strong>Trạng thái:</strong> {doctor.availability ? "🟢 Có sẵn" : "🔴 Không có sẵn"}</p>
          </div>
        ))}
      </div>

      <h3>Đặt Lịch Hẹn</h3>
      <form className="tuvan-form" onSubmit={handleSubmit}>
        <label>
          Ngày hẹn:
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </label>

        <label>
          Giờ hẹn:
          <input type="time" name="time" value={formData.time} onChange={handleChange} required />
        </label>

        <label>
          Ghi chú (không bắt buộc):
          <textarea name="message" value={formData.message} onChange={handleChange} />
        </label>

        <button type="submit" disabled={!selectedDoctor}>
          {isLoggedIn ? "📅 Đặt Lịch Hẹn" : "Vui lòng đăng nhập trước"}
        </button>
      </form>

      <button className="back-home-button" onClick={() => navigate("/")}>
        🏠 Quay lại Trang Chủ
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
