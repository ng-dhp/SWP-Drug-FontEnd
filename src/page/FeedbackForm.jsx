import React, { useState } from 'react';
import './css/FeedbackForm.css';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    consultant: '',
    course: '',
    email: '',
    feedback: '',
    date: new Date().toISOString().split('T')[0], // mặc định hôm nay
  });

  const [rating, setRating] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSend = {
      fullName: formData.fullName,
      consultant: formData.consultant,
      course: formData.course,
      email: formData.email,
      content: formData.feedback,
      rating: rating,
      date: formData.date
    };

    fetch('http://localhost:8080/api/v1.0/feedback/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Gửi thất bại');
        return res.json();
      })
      .then((data) => {
        alert('Gửi đánh giá thành công!');
        // Reset form
        setFormData({
          fullName: '',
          consultant: '',
          course: '',
          email: '',
          feedback: '',
          date: new Date().toISOString().split('T')[0],
        });
        setRating(0);
      })
      .catch((err) => {
        console.error(err);
        alert('Có lỗi xảy ra khi gửi đánh giá.');
      });
  };

  return (
    <>
      <div className="form-container">
        <h2>Đánh giá <span className="highlight">Khóa học Tư vấn</span></h2>
        <p>Chia sẻ trải nghiệm của bạn về các khóa học tư vấn phòng ngừa ma túy</p>

        <form className="feedback-form" onSubmit={handleSubmit}>
          <h3>Form Đánh giá</h3>

          <div className="form-group">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Nhập họ và tên của bạn"
              required
            />
            <input
              type="text"
              name="consultant"
              value={formData.consultant}
              onChange={handleChange}
              placeholder="Tên tư vấn viên đã hướng dẫn"
              required
            />
          </div>

          <select
            className="dropdown"
            name="course"
            value={formData.course}
            onChange={handleChange}
            required
          >
            <option value="">Chọn khóa học</option>
            <option value="k1">Khóa 1</option>
            <option value="k2">Khóa 2</option>
          </select>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="email@example.com"
          />

          <label className="rating-label">Đánh giá chất lượng khóa học *</label>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((value) => (
              <span
                key={value}
                className={rating >= value ? 'star selected' : 'star'}
                onClick={() => setRating(value)}
              >
                ★
              </span>
            ))}
          </div>

          <textarea
            name="feedback"
            value={formData.feedback}
            onChange={handleChange}
            placeholder="Chia sẻ trải nghiệm, cảm nhận của bạn về khóa học..."
            required
          />

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <button type="submit">📤 Gửi đánh giá</button>
        </form>
      </div>

      <div className="why-important">
        <h4>Tại sao đánh giá quan trọng?</h4>
        <ul>
          <li>Giúp chúng tôi cải thiện chất lượng dịch vụ tư vấn</li>
          <li>Hỗ trợ các tư vấn viên phát triển kỹ năng chuyên môn</li>
          <li>Tạo môi trường học tập tốt hơn cho học sinh khác</li>
          <li>Đóng góp vào việc phòng ngừa ma túy hiệu quả trong cộng đồng</li>
        </ul>
      </div>
    </>
  );
};

export default FeedbackForm;
