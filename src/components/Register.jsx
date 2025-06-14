import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./cssCom/register.css";

export default function RegisterModal({ onClose }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [yob, setYob] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    // Xác thực fullName
    if (!fullName.trim()) {
      newErrors.fullName = "Họ và tên không được để trống";
    }

    // Xác thực email
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!email) {
      newErrors.email = "Email không được để trống";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Email không đúng định dạng";
    }

    // Xác thực password
    if (!password) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (password.length < 8) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    }

    // Xác thực yob
    const yobNum = parseInt(yob);
    if (!yob) {
      newErrors.yob = "Năm sinh không được để trống";
    } else if (isNaN(yobNum) || yobNum < 1900) {
      newErrors.yob = "Năm sinh phải từ 1900 trở lên";
    }

    // Xác thực gender
    if (!gender) {
      newErrors.gender = "Giới tính không được để trống";
    }

    // Xác thực phone
    const phoneRegex = /^\d{10,11}$/;
    if (!phone) {
      newErrors.phone = "Số điện thoại không được để trống";
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = "Số điện thoại phải có 10 hoặc 11 chữ số";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const userData = {
      fullName: fullName.trim(),
      email,
      password,
      yob: parseInt(yob),
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
        const data = await response.json();
        console.log("User created:", data);
        // Chuyển hướng đến trang login với thông báo
        navigate("/login", { state: { message: "Đăng ký thành công!" } });
        setFullName("");
        setEmail("");
        setPassword("");
        setYob("");
        setGender("");
        setPhone("");
        onClose();
      } else {
        const errorData = await response.json();
        alert("Đăng ký thất bại: " + (errorData.message || "Lỗi không xác định."));
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      alert("Không thể kết nối đến máy chủ.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Đăng Ký</h2>
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Họ và tên:</label>
            <input
              type="text"
              placeholder="Họ và tên"
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
              placeholder="Email"
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
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>
          <div className="form-group">
            <label>Năm sinh:</label>
            <input
              type="number"
              placeholder="Ví dụ: 2000"
              value={yob}
              onChange={(e) => setYob(e.target.value)}
              required
            />
            {errors.yob && <p className="error">{errors.yob}</p>}
          </div>
          <div className="form-group">
            <label>Giới tính:</label>
            <select
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
              placeholder="Số điện thoại"
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
      </div>
    </div>
  );
}