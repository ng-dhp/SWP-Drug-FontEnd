// TuVan.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/tuvan.css";
import LoginModal from "../components/Login";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css"; // nếu cần đồng hồ
import Navbar from "../components/navbar";
import Register from "../components/Register"; // ✅ Đổi lại tên đúng


export default function TuVan() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [fullName, setFullName] = useState("");
  const [userId, setUserId] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [consultants, setConsultants] = useState([]);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const [formData, setFormData] = useState({
    date: "",
    time: "",
  });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");




  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

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
    setFormError(""); // 🔄 Xóa lỗi cũ

    if (!isLoggedIn) return setShowLoginModal(true);
    if (!selectedDoctor) return setFormError("❗ Vui lòng chọn bác sĩ.");
    if (!userId) return setFormError("❗ Không tìm thấy ID người dùng.");

    const token = localStorage.getItem("token");
    if (!token) return setFormError("❗ Token không hợp lệ!");
    const hour = parseInt(formData.time?.split(":")[0]);
    if (hour < 8 || hour > 15) {
      return setFormError("❗ Vui lòng chọn giờ trong khoảng từ 08:00 đến 15:00.");
    }


    const { date, time } = formData;

    const checkUrl = `http://localhost:8080/api/v1.0/appointment/check-slot-availability?consultantId=${selectedDoctor.consultantId}&date=${date}&startTime=${time}`;
    try {
      const checkRes = await fetch(checkUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!checkRes.ok) {
        const errorText = await checkRes.text();
        return setFormError(`❌ Lỗi kiểm tra slot: ${errorText}`);
      }

      const isAvailable = await checkRes.json();
      if (!isAvailable) {
        return setFormError("❌ Khung giờ này đã có người đặt. Vui lòng chọn thời gian khác.");
      }

      const payload = {
        userId,
        consultantId: selectedDoctor.consultantId,
        date,
        startTime: time,
        message: "",
        status: "Pending",
        location: "Phòng 203 - Tòa B",
      };

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
        setFormSuccess("🎉 Đặt lịch thành công!");
        setFormError(""); // clear lỗi nếu có
      } else {
        setFormError(`❌ Lỗi: ${text}`);
        setFormSuccess(""); // clear thành công nếu có
      }

    } catch (err) {
      setFormError("❌ Lỗi không xác định: " + err.message);
    }
  };


  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        onLogin={() => setShowLoginModal(true)}
        onRegister={() => setShowRegisterModal(true)}
        onLogout={handleLogout}
      />

      <div className="tuvan-container">
        <h2>🩺 Tư Vấn & Đặt Lịch Hẹn</h2>

        {isLoggedIn && (
          <p className="greeting">
            👋 Xin chào, <strong>{fullName}</strong>
          </p>
        )}

        <p>🧑‍⚕️ Chọn bác sĩ bạn muốn đặt lịch:</p>
        <div className="doctor-list">
          {consultants.map((doctor) => (
            <div
              key={doctor.consultantId}
              className={`doctor-card ${selectedDoctor?.consultantId === doctor.consultantId ? "selected" : ""
                }`}
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
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
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
          <div className="form-message">
            {formSuccess && <p className="form-success">{formSuccess}</p>}
            {formError && <p className="form-error">{formError}</p>}
          </div>

        </form>
      </div>

      {/* Modal hiển thị */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {showRegisterModal && (
        <Register onClose={() => setShowRegisterModal(false)} />
      )}
    </>
  );

}
