import React, { useState, useEffect } from 'react';
import './css/FeedbackForm.css';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    consultantId: '',
    courseId: '',
    programId: '',
    content: '',
  });

  const [consultants, setConsultants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Lấy danh sách tư vấn viên từ API
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("⚠️ Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      window.location.href = "/login";
      return;
    }

    fetch('http://localhost:8080/api/v1.0/consultant/getAllConsultant', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("Unauthorized - Vui lòng đăng nhập lại.");
          } else {
            throw new Error(`HTTP ${res.status}`);
          }
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setConsultants(data);
        } else {
          console.error("Phản hồi không hợp lệ:", data);
        }
      })
      .catch((err) => {
        console.error("❌ Lỗi khi tải danh sách tư vấn viên:", err.message);
        alert(err.message || "Có lỗi xảy ra khi tải danh sách tư vấn viên.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("⚠️ Bạn chưa đăng nhập. Vui lòng đăng nhập để gửi đánh giá.");
      window.location.href = "/login";
      return;
    }

    const dataToSend = {
      content: formData.content,
      consultantId: parseInt(formData.consultantId),
      courseId: parseInt(formData.courseId),
      programId: parseInt(formData.programId),
    };

    fetch('http://localhost:8080/api/v1.0/feedback/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dataToSend),
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) throw new Error("Bạn chưa đăng nhập hoặc phiên đã hết hạn.");
          throw new Error("Gửi đánh giá thất bại.");
        }
        return res.json();
      })
      .then(() => {
        alert('🎉 Gửi đánh giá thành công!');
        setFormData({
          consultantId: '',
          courseId: '',
          programId: '',
          content: '',
        });
      })
      .catch((err) => {
        console.error("❌", err.message);
        alert(err.message || "Có lỗi xảy ra khi gửi đánh giá.");
      });
  };

  return (
    <div className="form-container">
      <h2>Đánh giá <span className="highlight">Khóa học Tư vấn</span></h2>
      <p>Chia sẻ trải nghiệm của bạn về các khóa học tư vấn phòng ngừa ma túy</p>

      {isLoading ? (
        <p>🔄 Đang tải dữ liệu...</p>
      ) : (
        <form className="feedback-form" onSubmit={handleSubmit}>
          <h3>Form Đánh giá</h3>

          <select
            name="consultantId"
            value={formData.consultantId}
            onChange={handleChange}
            required
          >
            <option value="">Chọn tư vấn viên</option>
            {consultants.map((c) => (
              <option key={c.consultantId} value={c.consultantId}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            required
          >
            <option value="">Chọn khóa học</option>
            <option value="1">Khóa 1</option>
            <option value="2">Khóa 2</option>
          </select>

          <select
            name="programId"
            value={formData.programId}
            onChange={handleChange}
            required
          >
            <option value="">Chọn chương trình</option>
            <option value="5">Chương trình 5</option>
            <option value="6">Chương trình 6</option>
          </select>

          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Chia sẻ cảm nhận, trải nghiệm của bạn về khóa học..."
            required
          />

          <button type="submit">📤 Gửi đánh giá</button>
        </form>
      )}

      <div className="why-important">
        <h4>Tại sao đánh giá quan trọng?</h4>
        <ul>
          <li>Giúp cải thiện chất lượng dịch vụ tư vấn</li>
          <li>Hỗ trợ tư vấn viên phát triển kỹ năng</li>
          <li>Đóng góp cho cộng đồng học tập tích cực</li>
          <li>Góp phần phòng ngừa ma túy hiệu quả</li>
        </ul>
      </div>
    </div>
  );
};

export default FeedbackForm;
