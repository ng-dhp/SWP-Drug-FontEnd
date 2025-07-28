import React, { useState, useEffect } from "react";
import "./css/CreateCourse.css";
import API_ENDPOINTS from "../APIconfig";

export default function CreateCourse({ onCourseCreated, onClose }) {
  const [formData, setFormData] = useState({
    courseName: "",
    consultantId: "",
    price: "",
    location: "",
    startTime: "",
    endTime: "",
    maxCapacity: "",
  });

  const [consultants, setConsultants] = useState([]);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  // 🔄 Lấy danh sách tư vấn viên từ API
  useEffect(() => {
    if (!token) return;

    fetch(API_ENDPOINTS.CONSULTANTS, {
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
      courseName: formData.courseName,
      price: parseFloat(formData.price),
      location: formData.location,
      startTime: formData.startTime,
      endTime: formData.endTime,
      maxCapacity: parseInt(formData.maxCapacity),
      consultant: {
        consultantId: parseInt(formData.consultantId),
      },
    };

    console.log("🔼 Payload gửi lên backend:", payload);

    try {
      const res = await fetch(`${API_ENDPOINTS.ALL_COURSES.replace("/all", "")}`, {
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
        courseName: "",
        consultantId: "",
        price: "",
        location: "",
        startTime: "",
        endTime: "",
        maxCapacity: "",
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
            name="courseName"
            placeholder="Tên khóa học"
            value={formData.courseName}
            onChange={handleChange}
            required
          />

          <select
            name="consultantId"
            value={formData.consultantId}
            onChange={handleChange}
            required
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
            name="price"
            placeholder="Giá tiền (VNĐ)"
            value={formData.price}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="location"
            placeholder="Địa điểm"
            value={formData.location}
            onChange={handleChange}
            required
          />

          <input
            type="datetime-local"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
          />

          <input
            type="datetime-local"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="maxCapacity"
            placeholder="Số lượng tối đa"
            value={formData.maxCapacity}
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
