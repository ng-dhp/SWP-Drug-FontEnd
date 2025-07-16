import React, { useState } from "react";
import { motion } from "framer-motion";

const EditCampaign = ({ campaign, onClose, onSave }) => {
  const [editCampaign, setEditCampaign] = useState(campaign || {
    title: "",
    topic: "",
    startDate: "",
    endDate: "",
    time: "",
    location: "",
    host: "",
    description: "",
    image: "",
  });
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`; // Convert to yyyy-mm-dd for input type="date"
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Keep manual input if invalid
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditCampaign((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const formattedDate = value ? formatDateForDisplay(value) : ""; // Keep empty if no value
    setEditCampaign((prev) => ({ ...prev, [name]: formattedDate }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setEditCampaign((prev) => ({ ...prev, image: imageUrl }));
    }
  };

  const handleSaveEdit = () => {
    setIsConfirmModalVisible(true);
  };

  const handleConfirmSave = () => {
    onSave(editCampaign);
    setIsConfirmModalVisible(false);
    onClose();
  };

  const handleCancelConfirm = () => {
    setIsConfirmModalVisible(false);
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="modal-title">Chỉnh Sửa Chiến Dịch</h2>
        <div className="form-group">
          <label className="form-label">Tiêu đề chiến dịch</label>
          <input
            type="text"
            name="title"
            value={editCampaign.title}
            onChange={handleInputChange}
            className="form-input"
          />
          <label className="form-label">Chủ đề</label>
          <input
            type="text"
            name="topic"
            value={editCampaign.topic}
            onChange={handleInputChange}
            className="form-input"
          />
          <label className="form-label">Ngày bắt đầu</label>
          <input
            type="date"
            name="startDate"
            value={formatDateForInput(editCampaign.startDate)}
            onChange={handleDateChange}
            className="form-input date-input"
          />
          <label className="form-label">Ngày kết thúc</label>
          <input
            type="date"
            name="endDate"
            value={formatDateForInput(editCampaign.endDate)}
            onChange={handleDateChange}
            className="form-input date-input"
          />
          <label className="form-label">Giờ</label>
          <input
            type="text"
            name="time"
            value={editCampaign.time}
            onChange={handleInputChange}
            className="form-input"
            placeholder="VD: 08:00 - 16:00"
          />
          <label className="form-label">Địa điểm</label>
          <input
            type="text"
            name="location"
            value={editCampaign.location}
            onChange={handleInputChange}
            className="form-input"
          />
          <label className="form-label">Người host</label>
          <input
            type="text"
            name="host"
            value={editCampaign.host}
            onChange={handleInputChange}
            className="form-input"
          />
          <label className="form-label">Mô tả</label>
          <textarea
            name="description"
            value={editCampaign.description}
            onChange={handleInputChange}
            className="form-input"
          />
          <label className="form-label">Chọn hình ảnh chiến dịch</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="form-input file-input"
          />
          {editCampaign.image && (
            <img
              src={editCampaign.image}
              alt="Uploaded"
              className="event-image preview-image"
            />
          )}
        </div>
        <div className="button-group">
          <button className="join-button" onClick={handleSaveEdit}>
            Lưu Thay Đổi
          </button>
          <button
            className="join-button cancel-button"
            onClick={onClose}
          >
            Hủy
          </button>
        </div>
      </motion.div>

      {isConfirmModalVisible && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCancelConfirm}
        >
          <motion.div
            className="modal-content"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="modal-title">Xác Nhận Thay Đổi</h2>
            <p className="confirm-message">Bạn có xác nhận thay đổi?</p>
            <div className="button-group">
              <button className="join-button" onClick={handleConfirmSave}>
                Xác Nhận
              </button>
              <button
                className="join-button cancel-button"
                onClick={handleCancelConfirm}
              >
                Hủy
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EditCampaign;