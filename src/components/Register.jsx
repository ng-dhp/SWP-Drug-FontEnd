import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OTPModal from "./OTPModal";
import "./cssCom/register.css";
import { registerUser } from "../api/ServiceAPI"; 

export default function RegisterModal({ onClose }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [yob, setYob] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});
  const [showOtpModal, setShowOtpModal] = useState(false);
  const navigate = useNavigate();

  const formatYearInput = (value) => {
    let cleaned = value.replace(/[^0-9]/g, "");
    return cleaned.slice(0, 4);
  };

  const handleYobChange = (e) => {
    setYob(formatYearInput(e.target.value));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!fullName.trim()) newErrors.fullName = "Họ và tên không được để trống";

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!email) newErrors.email = "Email không được để trống";
    else if (!emailRegex.test(email)) newErrors.email = "Email không đúng định dạng";

    if (!password) newErrors.password = "Mật khẩu không được để trống";
    else if (password.length < 8) newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";

    const yobRegex = /^\d{4}$/;
    const currentYear = new Date().getFullYear();
    if (!yob) newErrors.yob = "Năm sinh không được để trống";
    else if (!yobRegex.test(yob) || yob < 1900 || yob > currentYear) {
      newErrors.yob = `Năm sinh phải từ 1900 đến ${currentYear}`;
    }

    if (!gender) newErrors.gender = "Giới tính không được để trống";

    const phoneRegex = /^\d{10,11}$/;
    if (!phone) newErrors.phone = "Số điện thoại không được để trống";
    else if (!phoneRegex.test(phone)) newErrors.phone = "SĐT phải có 10 hoặc 11 chữ số";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const userData = {
      fullName: fullName.trim(),
      email,
      password,
      yob,
      gender,
      phone,
    };

    try {
      await registerUser(userData);
      setShowOtpModal(true);
      setFullName("");
      setEmail("");
      setPassword("");
      setYob("");
      setGender("");
      setPhone("");
    } catch (error) {
      console.error("Lỗi khi đăng ký:", error);
      alert("Đăng ký thất bại: " + error.message);
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
            <label>Năm sinh:</label>
            <input
              type="text"
              placeholder="yyyy"
              value={yob}
              onChange={handleYobChange}
              maxLength="4"
              required
            />
            {errors.yob && <p className="error">{errors.yob}</p>}
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
