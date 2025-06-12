import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- import hook điều hướng
import "./css/tuvan.css";
import LoginModal from "../components/Login";

export default function TuVan() {
    const navigate = useNavigate(); // <-- Khai báo hook điều hướng

    const doctors = [
        {
            id: 1,
            name: "Bác sĩ Nguyễn Văn A",
            specialty: "Tư vấn tâm lý",
            experience: "10 năm kinh nghiệm",
            email: "bs.nguyenA@clinic.com",
        },
        {
            id: 2,
            name: "Bác sĩ Trần Thị B",
            specialty: "Tư vấn cai nghiện",
            experience: "8 năm kinh nghiệm",
            email: "bs.tranB@clinic.com",
        },
    ];

    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        date: "",
        message: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isLoggedIn) {
            setShowLoginModal(true);
            return;
        }

        if (!selectedDoctor) {
            alert("Vui lòng chọn bác sĩ trước khi đặt lịch!");
            return;
        }

        alert("Bạn đã đặt lịch hẹn thành công. Tư vấn viên sẽ sớm liên hệ với bạn!");

        // Reset form
        setFormData({
            name: "",
            email: "",
            phone: "",
            date: "",
            message: "",
        });
        setSelectedDoctor(null);
    };

    return (
        <div className="tuvan-container">
            <h2>Trang Tư Vấn & Đặt Lịch Hẹn</h2>
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
                    </div>
                ))}
            </div>

            <h3>Đặt Lịch Hẹn</h3>
            <form className="tuvan-form" onSubmit={handleSubmit}>
                <label>
                    Họ và Tên:
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Nhập họ tên"
                    />
                </label>

                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Nhập email"
                    />
                </label>

                <label>
                    Số điện thoại:
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="Nhập số điện thoại"
                    />
                </label>

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
                    Ghi chú:
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Ghi chú thêm (nếu có)"
                    />
                </label>

                {!isLoggedIn ? (
                    <button
                        type="button"
                        onClick={() => setShowLoginModal(true)}
                    >
                        Vui lòng đăng nhập trước
                    </button>
                ) : (
                    <button
                        type="submit"
                        disabled={!selectedDoctor}
                    >
                        Đặt Lịch Hẹn
                    </button>
                )}
            </form>

            {/* Nút quay lại trang chủ */}
            <button
                className="back-home-button"
                onClick={() => navigate("/")} // <-- Đường dẫn về trang chủ ("/")
            >
                Quay lại Trang Chủ
            </button>

            {showLoginModal && (
                <LoginModal
                    onClose={() => setShowLoginModal(false)}
                    onLoginSuccess={() => {
                        setIsLoggedIn(true);
                        setShowLoginModal(false);
                        alert("Đăng nhập thành công!");
                    }}
                />
            )}
        </div>
    );
}
