// src/components/ChienDich.jsx
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./css/ChienDich.css";

const ChienDich = () => {
  const navigate = useNavigate();

  const handleJoinChiendich01 = () => {
    navigate("/chiendich01");
  };

  return (
    <div className="event-page">
      <motion.button
        className="back-button"
        onClick={() => navigate("/")}
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
          <img
            src="https://i.imgur.com/uOvU87n.jpeg"
            alt="Chung tay không ma túy"
            className="event-image"
          />
          <h2>Chiến dịch: Chung tay vì cộng đồng không ma túy</h2>
          <p className="event-topic">📌 Chủ đề: Nâng cao nhận thức cộng đồng</p>
          <p className="event-date">📅 Thời gian: 20/06/2025 - 22/06/2025</p>
          <p className="event-time">🕒 Giờ: 08:00 - 16:00 mỗi ngày</p>
          <p className="event-location">📍 Địa điểm: Trung tâm Văn hóa TP. Hà Nội</p>
          <p className="event-host">👤 Người host: Nguyễn Văn A</p>
          <p className="event-description">
            🎯 Mô tả: Chiến dịch bao gồm các buổi hội thảo, trưng bày, và giao lưu nhằm tăng cường ý thức cộng đồng về tác hại của chất gây nghiện.
          </p>
          <button className="join-button" onClick={handleJoinChiendich01}>
            Tham gia
          </button>
        </motion.div>
 <motion.div
          className="event-card"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <img
            src="https://datafiles.nghean.gov.vn/nan-ubnd/2928/quantritintuc/ma-tuy-truong-hoc_01072022638136508723583066.png"
            alt="Phòng chống ma túy tại trường học"
            className="event-image"
          />
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

        <motion.div
          className="event-card"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <img
            src="https://i.ytimg.com/vi/CL7bKrJDr6U/maxresdefault.jpg"
            alt="Hỗ trợ cai nghiện cộng đồng"
            className="event-image"
          />
          <h2>Chiến dịch: Hỗ trợ cai nghiện cộng đồng</h2>
          <p className="event-topic">📌 Chủ đề: Hỗ trợ người nghiện phục hồi</p>
          <p className="event-date">📅 Thời gian: 01/07/2025 - 03/07/2025</p>
          <p className="event-time">🕒 Giờ: 10:00 - 17:00 mỗi ngày</p>
          <p className="event-location">📍 Địa điểm: Trung tâm Y tế Quận Hoàn Kiếm</p>
          <p className="event-host">👤 Người host: Lê Văn C</p>
          <p className="event-description">
            🎯 Mô tả: Chương trình cung cấp tư vấn và hỗ trợ cai nghiện, kết hợp với các buổi tập huấn cho cộng đồng.
          </p>
          <button className="join-button">Tham gia</button>
        </motion.div>

        <motion.div
          className="event-card"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <img
            src="https://th.bing.com/th/id/OIP.3sQgJkq533E_hJVH5dTgDgHaE0?r=0&rs=1&pid=ImgDetMain"
            alt="Nâng cao nhận thức gia đình"
            className="event-image"
          />
          <h2>Chiến dịch: Nâng cao nhận thức gia đình</h2>
          <p className="event-topic">📌 Chủ đề: Bảo vệ gia đình khỏi ma túy</p>
          <p className="event-date">📅 Thời gian: 05/07/2025 - 07/07/2025</p>
          <p className="event-time">🕒 Giờ: 13:00 - 18:00</p>
          <p className="event-location">📍 Địa điểm: Nhà Văn hóa Phường Nguyễn Du</p>
          <p className="event-host">👤 Người host: Phạm Thị D</p>
          <p className="event-description">
            🎯 Mô tả: Tổ chức hội thảo và phân phát tài liệu giáo dục cho các gia đình nhằm nâng cao nhận thức về phòng chống ma túy.
          </p>
          <button className="join-button">Tham gia</button>
        </motion.div>
        ...
      </div>
    </div>
  );
};

export default ChienDich;
