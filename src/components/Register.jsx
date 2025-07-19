import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import OTPModal from "./OTPModal";
import "./cssCom/register.css";

export default function RegisterModal({ onClose }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState(null);
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});
  const [showOtpModal, setShowOtpModal] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!fullName.trim()) newErrors.fullName = "Họ và tên không được để trống";

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!email) newErrors.email = "Email không được để trống";
    else if (!emailRegex.test(email))
      newErrors.email = "Email không đúng định dạng";

    if (!password) newErrors.password = "Mật khẩu không được để trống";
    else if (password.length < 8)
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
   if (!dob) {
  newErrors.dob = "Ngày sinh không được để trống";
} else {
  const today = new Date();
  const minAllowedDate = new Date(
    today.getFullYear() - 12,
    today.getMonth(),
    today.getDate()
  );
  if (dob > minAllowedDate) {
    newErrors.dob = "Bạn phải từ 12 tuổi trở lên.";
  } else if (dob.getFullYear() < 1900) {
    newErrors.dob = "Năm sinh không hợp lệ (từ 1900 trở lên)";
  }
}



    if (!gender) newErrors.gender = "Giới tính không được để trống";

    const phoneRegex = /^\d{10}$/;
    if (!phone) newErrors.phone = "Số điện thoại không được để trống";
    else if (!phoneRegex.test(phone))
      newErrors.phone = "Số điện thoại phải có 10 chữ số";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const year = dob.getFullYear();

    const userData = {
      fullName: fullName.trim(),
      email,
      password,
      yob: year,
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
        setDob(null);
        setGender("");
        setPhone("");
      } else {
        const errorData = await response.json();
        alert(
          "Đăng ký thất bại: " + (errorData.message || "Lỗi không xác định.")
        );
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
           <DatePicker
  selected={dob}
  onChange={(date) => setDob(date)}
  dateFormat="dd/MM/yyyy"
  placeholderText="Nhập ngày tháng năm (VD:22/06/2004)"
  className="custom-datepicker"
  showMonthDropdown
  showYearDropdown
  dropdownMode="select"
  minDate={new Date(1900, 0, 1)}   // Vẫn giới hạn tối thiểu năm 1900
  maxDate={new Date()}             // Không khóa năm 2013, cho chọn tới hiện tại
  isClearable
/>



            {errors.dob && <p className="error">{errors.dob}</p>}
          </div>

          <div className="form-group1">
            <label>Giới tính:</label>
            <select
              className="gioitinh"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
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

          <button type="submit" className="nutdangky">
            Đăng Ký
          </button>
        </form>

        <button className="close-button" onClick={onClose}>
          Đóng
        </button>

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
