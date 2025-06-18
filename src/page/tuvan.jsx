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

    const [formData, setFormData] = useState({
        date: "",
        time: "",
        message: "",
    });

    // Giả định ID của consultant tương ứng với ID backend
    const doctors = [
        {
            id: 1,
            name: "Bác sĩ Nguyễn Văn A",
            specialty: "Tư vấn tâm lý",
            experience: "10 năm kinh nghiệm",
            email: "bs.nguyenA@clinic.com",
            consultantId: 1, // <- cần trùng với ID ở backend
            location: "Phòng 201",
        },
        {
            id: 2,
            name: "Bác sĩ Trần Thị B",
            specialty: "Tư vấn cai nghiện",
            experience: "8 năm kinh nghiệm",
            email: "bs.tranB@clinic.com",
            consultantId: 2,
            location: "Phòng 202",
        },
    ];

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
            location: selectedDoctor.location, // ⬅️ Gắn location
            consultantId: selectedDoctor.consultantId, // ⬅️ Gắn consultantId
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

            {isLoggedIn && <p className="greeting">👋 Xin chào, <strong>{fullName}</strong></p>}

            <p>Chọn bác sĩ bạn muốn đặt lịch:</p>
            <div className="doctor-list">
                {doctors.map((doctor) => (
                    <div
                        key={doctor.id}
                        className={`doctor-card ${selectedDoctor?.id === doctor.id ? "selected" : ""}`}
                        onClick={() => setSelectedDoctor(doctor)}
                    >
                        <h3>{doctor.name}</h3>
                        <p><strong>Chuyên ngành:</strong> {doctor.specialty}</p>
                        <p><strong>Kinh nghiệm:</strong> {doctor.experience}</p>
                        <p><strong>Email:</strong> {doctor.email}</p>
                        <p><strong>Phòng:</strong> {doctor.location}</p>
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
                    Ghi chú:
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
