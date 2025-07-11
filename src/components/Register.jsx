import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OTPModal from "./OTPModal";
import "./cssCom/register.css";

export default function RegisterModal({ onClose }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});
  const [showOtpModal, setShowOtpModal] = useState(false);
  const navigate = useNavigate();

  const formatDateInput = (value) => {
    let cleaned = value.replace(/[^0-9/]/g, "");
    if (cleaned.length > 10) {
      cleaned = cleaned.slice(0, 10);
    }
    if (cleaned.length > 2 && cleaned[2] !== "/") {
      cleaned = cleaned.slice(0, 2) + "/" + cleaned.slice(2);
    }
    if (cleaned.length > 5 && cleaned[5] !== "/") {
      cleaned = cleaned.slice(0, 5) + "/" + cleaned.slice(5);
    }

    return cleaned;
  };

  const handleDobChange = (e) => {
    const formatted = formatDateInput(e.target.value);
    setDob(formatted);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!fullName.trim()) newErrors.fullName = "Họ và tên không được để trống";

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!email) newErrors.email = "Email không được để trống";
    else if (!emailRegex.test(email)) newErrors.email = "Email không đúng định dạng";

    if (!password) newErrors.password = "Mật khẩu không được để trống";
    else if (password.length < 8) newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";

    const dobRegex = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/(19\d{2}|20\d{2})$/;
    if (!dob) newErrors.dob = "Ngày sinh không được để trống";
    else if (!dobRegex.test(dob)) {
      newErrors.dob = "Ngày sinh phải có định dạng dd/mm/yyyy và hợp lệ (từ 1900)";
    } else {
      const [day, month, year] = dob.split("/").map(Number);
      const date = new Date(year, month - 1, day);
      const isValidDate =
        date.getDate() === day &&
        date.getMonth() === month - 1 &&
        date.getFullYear() === year;
      if (!isValidDate || year < 1900) {
        newErrors.dob = "Ngày sinh không hợp lệ (từ 1900)";
      }
    }

    if (!gender) newErrors.gender = "Giới tính không được để trống";

    const phoneRegex = /^\d{10,11}$/;
    if (!phone) newErrors.phone = "Số điện thoại không được để trống";
    else if (!phoneRegex.test(phone)) newErrors.phone = "Số điện thoại phải có 10 hoặc 11 chữ số";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const yearOfBirth = parseInt(dob.split("/")[2]);

    const userData = {
      fullName: fullName.trim(),
      email,
      password,
      yob: yearOfBirth,
      gender,
      phone,
    };

    try {
      const response = await fetch("http://localhost:8080/api/v1.0/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        setShowOtpModal(true);
        setFullName("");
        setEmail("");
        setPassword("");
        setDob("");
        setGender("");
        setPhone("");
      } else {
        const errorData = await response.json();
        alert("Đăng ký thất bại: " + (errorData.message || "Lỗi không xác định."));
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      alert("Không thể kết nối đến máy chủ.");
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <h2>Đăng Ký</h2>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Họ và tên:</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            {errors.fullName && <p className="error">{errors.fullName}</p>}
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label>Mật khẩu:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label>Ngày sinh:</label>
            <input
              type="text"
              placeholder="dd/mm/yyyy"
              value={dob}
              onChange={handleDobChange}
              maxLength="10"
              required
            />
            {errors.dob && <p className="error">{errors.dob}</p>}
          </div>

          <div className="form-group">
            <label>Giới tính:</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)} required>
              <option value="">Chọn giới tính</option>
              <option value="Male">Nam</option>
              <option value="Female">Nữ</option>
              <option value="Other">Khác</option>
            </select>
            {errors.gender && <p className="error">{errors.gender}</p>}
          </div>

          <div className="form-group">
            <label>Số điện thoại:</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            {errors.phone && <p className="error">{errors.phone}</p>}
          </div>

          <button type="submit" className="nutdangky">Đăng Ký</button>
        </form>

        <button className="close-button" onClick={onClose}>Đóng</button>

        {showOtpModal && (
          <div className="modal-overlay" onClick={handleOverlayClick}>
            <OTPModal
              email={email}
              onVerify={() => {
                alert("✅ Xác minh thành công!");
                setShowOtpModal(false);
                onClose();
              }}
              onClose={() => setShowOtpModal(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
