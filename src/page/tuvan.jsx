import React, { useState } from "react";

export default function TuVan() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    message: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Đặt lịch thành công! Thông tin: ${JSON.stringify(formData, null, 2)}`);
    // Ở đây bạn có thể gửi dữ liệu lên server
    setFormData({
      name: "",
      email: "",
      phone: "",
      date: "",
      message: ""
    });
  };

  return (
    <div className="tuvan-container">
      <h2>Trang Tư Vấn & Đặt Lịch Hẹn</h2>
      <p>Hãy để chúng tôi hỗ trợ bạn! Vui lòng điền thông tin để đặt lịch hẹn.</p>

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

        <button type="submit">Đặt Lịch Hẹn</button>
      </form>
    </div>
  );
}
