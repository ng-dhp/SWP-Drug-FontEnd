import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './css/ChienDich.css';
import chungtayImage from "../assets/anh_tuchoi.png"; // Thay bằng đường dẫn thực tế
import phongchongImage from "../assets/anh_tuchoi.png"; // Thay bằng đường dẫn thực tế

const ChienDich = () => {
  const navigate = useNavigate();

  return (
    <div className="event-page">
      <motion.button
        className="back-button"
        onClick={() => navigate('/')}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        ← Quay lại
      </motion.button>
      <header className="event-header">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Chiến Dịch Tuyên Truyền
        </motion.h1>
      </header>

      <div className="event-container">
        <motion.div
          className="event-card"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <img src={chungtayImage} alt="Chung tay không ma túy" className="event-image" />
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
        </motion.div>

        <motion.div
          className="event-card"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <img src={phongchongImage} alt="Phòng chống ma túy tại trường học" className="event-image" />
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
        </motion.div>
      </div>
    </div>
  );
};

export default ChienDich;