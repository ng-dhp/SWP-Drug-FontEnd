import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CreateCampaign from "./CreateCampaign";
import EditCampaign from "./EditCampaign";
import "./css/ChienDich.css";

const ChienDich = () => {
  const navigate = useNavigate();
  const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [editCampaign, setEditCampaign] = useState(null);
  const [campaigns, setCampaigns] = useState([
    {
      title: "Chung tay vì cộng đồng không ma túy",
      topic: "Nâng cao nhận thức cộng đồng",
      startDate: "20/06/2025",
      endDate: "22/06/2025",
      time: "08:00 - 16:00 mỗi ngày",
      location: "Trung tâm Văn hóa TP. Hà Nội",
      host: "Nguyễn Văn A",
      description: "Chiến dịch bao gồm các buổi hội thảo, trưng bày, và giao lưu nhằm tăng cường ý thức cộng đồng về tác hại của chất gây nghiện.",
      image: "https://i.imgur.com/uOvU87n.jpeg",
    },
    {
      title: "Phòng chống ma túy tại trường học",
      topic: "Giáo dục học sinh tránh xa ma túy",
      startDate: "25/06/2025",
      endDate: "27/06/2025",
      time: "09:00 - 15:00",
      location: "Trường THPT Chuyên Hà Nội - Amsterdam",
      host: "Trần Thị B",
      description: "Buổi nói chuyện chuyên đề kết hợp hoạt động nhóm cho học sinh nhằm nâng cao kỹ năng phòng chống ma túy.",
      image: "https://datafiles.nghean.gov.vn/nan-ubnd/2928/quantritintuc/ma-tuy-truong-hoc_01072022638136508723583066.png",
    },
    {
      title: "Hỗ trợ cai nghiện cộng đồng",
      topic: "Hỗ trợ người nghiện phục hồi",
      startDate: "01/07/2025",
      endDate: "03/07/2025",
      time: "10:00 - 17:00 mỗi ngày",
      location: "Trung tâm Y tế Quận Hoàn Kiếm",
      host: "Lê Văn C",
      description: "Chương trình cung cấp tư vấn và hỗ trợ cai nghiện, kết hợp với các buổi tập huấn cho cộng đồng.",
      image: "https://i.ytimg.com/vi/CL7bKrJDr6U/maxresdefault.jpg",
    },
    {
      title: "Nâng cao nhận thức gia đình",
      topic: "Bảo vệ gia đình khỏi ma túy",
      startDate: "05/07/2025",
      endDate: "07/07/2025",
      time: "13:00 - 18:00",
      location: "Nhà Văn hóa Phường Nguyễn Du",
      host: "Phạm Thị D",
      description: "Tổ chức hội thảo và phân phát tài liệu giáo dục cho các gia đình nhằm nâng cao nhận thức về phòng chống ma túy.",
      image: "https://th.bing.com/th/id/OIP.3sQgJkq533E_hJVH5dTgDgHaE0?r=0&rs=1&pid=ImgDetMain",
    },
  ]);

  const handleEditCampaign = (campaign) => {
    setEditCampaign(campaign);
    setIsEditFormVisible(true);
  };

  const handleSaveEdit = (updatedCampaign) => {
    console.log("Edited Campaign:", updatedCampaign);
    setCampaigns(campaigns.map((c) =>
      c.title === updatedCampaign.title ? updatedCampaign : c
    ));
    setEditCampaign(null);
  };

  const handleCreateCampaign = (newCampaign) => {
    console.log("New Campaign:", newCampaign);
    setCampaigns([...campaigns, newCampaign]);
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

      <motion.button
        className="join-button create-button"
        onClick={() => setIsCreateFormVisible(true)}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ margin: "1.5rem 0" }}
      >
        Tạo Chiến Dịch
      </motion.button>

      {isCreateFormVisible && (
        <CreateCampaign
          onClose={() => setIsCreateFormVisible(false)}
          onCreate={handleCreateCampaign}
        />
      )}

      {isEditFormVisible && editCampaign && (
        <EditCampaign
          campaign={editCampaign}
          onClose={() => setIsEditFormVisible(false)}
          onSave={handleSaveEdit}
        />
      )}

      <div className="event-container">
        {campaigns.map((campaign, index) => (
          <motion.div
            key={index}
            className="event-card"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            viewport={{ once: true }}
          >
            <img
              src={campaign.image}
              alt={campaign.title}
              className="event-image"
            />
            <h2>{`Chiến dịch: ${campaign.title}`}</h2>
            <p className="event-topic">📌 Chủ đề: {campaign.topic}</p>
            <p className="event-date">📅 Ngày bắt đầu: {campaign.startDate}</p>
            <p className="event-date">📅 Ngày kết thúc: {campaign.endDate}</p>
            <p className="event-time">🕒 Giờ: {campaign.time}</p>
            <p className="event-location">📍 Địa điểm: {campaign.location}</p>
            <p className="event-host">👤 Người host: {campaign.host}</p>
            <p className="event-description">
              🎯 Mô tả: {campaign.description}
            </p>
            <button className="join-button">Tham gia</button>
            <button
              className="join-button edit-button"
              onClick={() => handleEditCampaign(campaign)}
            >
              Chỉnh Sửa
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ChienDich;