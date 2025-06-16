import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/ChienDich.css';

const ChienDich = () => {
  const navigate = useNavigate();

  return (
    <div className="event-page">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Quay lại
      </button>
      <header className="event-header">
        <h1>Chiến Dịch Tuyên Truyền</h1>
      </header>

      <div className="event-container">
        <div className="event-card">
          <h2>Chiến dịch: Chung tay vì cộng đồng không ma túy</h2>
          <p className="event-topic">📌 Chủ đề: Nâng cao nhận thức cộng đồng</p>
          <p className="event-date">📅 Thời gian: 20/06/2025 - 22/06/2025</p>
          <p className="event-time">🕒 Giờ: 08:00 - 16:00 mỗi ngày</p>
          <p className="event-location">📍 Địa điểm: Trung tâm Văn hóa TP. Hà Nội</p>
          <p className="event-host">👤 Người host: Nguyễn Văn A</p>
          <p className="event-description">
            🎯 Mô tả: Chiến dịch bao gồm các buổi hội thảo, trưng bày, và giao lưu nhằm tăng cường ý thức cộng đồng về tác hại của chất gây nghiện.
          </p>
          <button className="join-button">Tham gia</button>
        </div>

        <div className="event-card">
          <h2>Chiến dịch: Phòng chống ma túy tại trường học</h2>
          <p className="event-topic">📌 Chủ đề: Giáo dục học sinh tránh xa ma túy</p>
          <p className="event-date">📅 Thời gian: 25/06/2025 - 27/06/2025</p>
          <p className="event-time">🕒 Giờ: 09:00 - 15:00</p>
          <p className="event-location">📍 Địa điểm: Trường THPT Chuyên Hà Nội - Amsterdam</p>
          <p className="event-host">👤 Người host: Trần Thị B</p>
          <p className="event-description">
            🎯 Mô tả: Buổi nói chuyện chuyên đề kết hợp hoạt động nhóm cho học sinh nhằm nâng cao kỹ năng phòng chống ma túy.
          </p>
          <button className="join-button">Tham gia</button>
        </div>
      </div>
    </div>
  );
};

export default ChienDich;