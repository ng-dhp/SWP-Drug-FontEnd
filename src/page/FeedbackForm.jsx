import React, { useState } from 'react';
import './css/FeedbackForm.css';

const FeedbackForm = () => {
  const [rating, setRating] = useState(0);

  const handleStarClick = (value) => {
    setRating(value);
  };

  return (
    <>
      <div className="form-container">
        <h2>Đánh giá <span className="highlight">Khóa học Tư vấn</span></h2>
        <p>Chia sẻ trải nghiệm của bạn về các khóa học tư vấn phòng ngừa ma túy</p>

        <form className="feedback-form">
          <h3>Form Đánh giá</h3>

          <div className="form-group">
            <input type="text" placeholder="Nhập họ và tên của bạn" required />
            <input type="text" placeholder="Tên tư vấn viên đã hướng dẫn" required />
          </div>

          <select className="dropdown" required>
            <option value="">Chọn khóa học</option>
            <option value="k1">Khóa 1</option>
            <option value="k2">Khóa 2</option>
          </select>

          <input type="email" placeholder="email@example.com" />

          <label className="rating-label">Đánh giá chất lượng khóa học *</label>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((value) => (
              <span
                key={value}
                className={rating >= value ? 'star selected' : 'star'}
                onClick={() => handleStarClick(value)}
              >
                ★
              </span>
            ))}
          </div>

          <textarea placeholder="Chia sẻ trải nghiệm, cảm nhận của bạn về khóa học..." required></textarea>

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
