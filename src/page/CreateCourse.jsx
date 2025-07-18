import React, { useState, useEffect } from "react";
import "./css/CreateCourse.css";

export default function CreateCourse({ onCourseCreated, onClose }) {
  const [formData, setFormData] = useState({
    tenKhoaHoc: "",
    consultantId: "",
    giaTien: "",
    diaDiem: "",
    thoiGianBatDau: "",
    thoiGianKetThuc: "",
    soLuongToiDa: "",
  });

  const [consultants, setConsultants] = useState([]);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  // 🔄 Lấy danh sách tư vấn viên từ API
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:8080/api/v1.0/consultant/getAllConsultant", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setConsultants(data);
        console.log("📌 Danh sách tư vấn viên:", data);
      })
      .catch((err) => console.error("❌ Lỗi khi load tư vấn viên:", err));
  }, [token]);

  // ✏️ Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 📤 Gửi dữ liệu lên backend để tạo khóa học
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      giaTien: parseFloat(formData.giaTien),
      soLuongToiDa: parseInt(formData.soLuongToiDa),
      // ❗️ Không dùng toISOString để tránh nhảy giờ
      thoiGianBatDau: formData.thoiGianBatDau,
      thoiGianKetThuc: formData.thoiGianKetThuc,
      consultant: {
        consultantId: parseInt(formData.consultantId),
      },
    };

    console.log("🔼 Payload gửi lên backend:", payload);

    try {
      const res = await fetch("http://localhost:8080/api/v1.0/khoahoc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Lỗi từ server:", errorText);
        throw new Error(errorText);
      }

      setMessage("✅ Khóa học đã được tạo thành công!");

      // Reset form
      setFormData({
        tenKhoaHoc: "",
        consultantId: "",
        giaTien: "",
        diaDiem: "",
        thoiGianBatDau: "",
        thoiGianKetThuc: "",
        soLuongToiDa: "",
      });

      if (onCourseCreated) onCourseCreated();
    } catch (err) {
      console.error("🚨 Lỗi gửi dữ liệu:", err);
      setMessage(`❌ Lỗi: ${err.message}`);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h3>Thêm Khóa Học Mới</h3>

        <form className="create-course-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="tenKhoaHoc"
            placeholder="Tên khóa học"
            value={formData.tenKhoaHoc}
            onChange={handleChange}
            required
          />

          <select
            name="consultantId"
            value={formData.consultantId}
            onChange={handleChange}
            required
            className="consultant-select"
          >
            <option value="">-- Chọn tư vấn viên --</option>
            {consultants.map((c) => (
              <option key={c.consultantId} value={c.consultantId}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="giaTien"
            placeholder="Giá tiền (VNĐ)"
            value={formData.giaTien}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="diaDiem"
            placeholder="Địa điểm"
            value={formData.diaDiem}
            onChange={handleChange}
            required
          />

          <input
            type="datetime-local"
            name="thoiGianBatDau"
            value={formData.thoiGianBatDau}
            onChange={handleChange}
            required
          />

          <input
            type="datetime-local"
            name="thoiGianKetThuc"
            value={formData.thoiGianKetThuc}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="soLuongToiDa"
            placeholder="Số lượng tối đa"
            value={formData.soLuongToiDa}
            onChange={handleChange}
            required
          />

          <button type="submit">Tạo khóa học</button>

          {message && <p className="message">{message}</p>}
        </form>
      </div>
    </div>
  );
}
