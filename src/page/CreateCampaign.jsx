import React, { useState } from "react";
import { motion } from "framer-motion";

const EditCampaign = ({ onClose }) => {
  const [editCampaign, setEditCampaign] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    questions: [],
  });
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditCampaign((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setEditCampaign((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...editCampaign.questions];
    updated[index][field] = value;
    setEditCampaign((prev) => ({ ...prev, questions: updated }));
  };

  const handleOptionChange = (qIndex, oIndex, field, value) => {
    const updated = [...editCampaign.questions];
    updated[qIndex].options[oIndex][field] = field === "score" ? parseInt(value) : value;
    setEditCampaign((prev) => ({ ...prev, questions: updated }));
  };

  const addQuestion = () => {
    setEditCampaign((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        { content: "", type: "TEXT", options: [] },
      ],
    }));
  };

  const removeQuestion = (index) => {
    const updated = [...editCampaign.questions];
    updated.splice(index, 1);
    setEditCampaign((prev) => ({ ...prev, questions: updated }));
  };

  const addOption = (qIndex) => {
    const updated = [...editCampaign.questions];
    if (!updated[qIndex].options) updated[qIndex].options = [];
    updated[qIndex].options.push({ text: "", score: 0 });
    setEditCampaign((prev) => ({ ...prev, questions: updated }));
  };

  const removeOption = (qIndex, oIndex) => {
    const updated = [...editCampaign.questions];
    updated[qIndex].options.splice(oIndex, 1);
    setEditCampaign((prev) => ({ ...prev, questions: updated }));
  };

  const handleSaveEdit = () => {
    setIsConfirmModalVisible(true);
  };

  const handleConfirmSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = {
        name: editCampaign.title,
        description: editCampaign.description,
        startDate: editCampaign.startDate,
        endDate: editCampaign.endDate,
        questions: editCampaign.questions,
      };

      const response = await fetch("http://localhost:8080/api/v1.0/campaigns/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Import thất bại");

      alert("Tạo chiến dịch thành công!");
      setIsConfirmModalVisible(false);
      onClose();
    } catch (error) {
      console.error("Lỗi khi gửi API:", error);
      alert("Có lỗi khi lưu chiến dịch.");
    }
  };

  const handleCancelConfirm = () => setIsConfirmModalVisible(false);

  return (
    <motion.div className="modal-overlay" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="modal-content" onClick={(e) => e.stopPropagation()} initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}>
        <h2>Chỉnh sửa chiến dịch</h2>
        <div className="form-group">
          <label>Tiêu đề</label>
          <input type="text" name="title" value={editCampaign.title} onChange={handleInputChange} />

          <label>Mô tả</label>
          <textarea name="description" value={editCampaign.description} onChange={handleInputChange} />

          <label>Ngày bắt đầu</label>
          <input type="date" name="startDate" value={editCampaign.startDate} onChange={handleDateChange} />

          <label>Ngày kết thúc</label>
          <input type="date" name="endDate" value={editCampaign.endDate} onChange={handleDateChange} />

          <hr />
          <h3>Câu hỏi khảo sát</h3>
          {editCampaign.questions.map((q, index) => (
            <div key={index} className="question-block">
              <label>Câu hỏi {index + 1}</label>
              <input type="text" value={q.content} onChange={(e) => handleQuestionChange(index, "content", e.target.value)} />
              <select value={q.type} onChange={(e) => handleQuestionChange(index, "type", e.target.value)}>
                <option value="TEXT">Tự luận</option>
                <option value="MULTIPLE_CHOICE">Trắc nghiệm</option>
              </select>

              {q.type === "MULTIPLE_CHOICE" && (
                <div className="options">
                  {q.options?.map((opt, oIndex) => (
                    <div key={oIndex} className="option-item">
                      <input type="text" placeholder="Nội dung" value={opt.text} onChange={(e) => handleOptionChange(index, oIndex, "text", e.target.value)} />
                      <input type="number" placeholder="Điểm" value={opt.score} onChange={(e) => handleOptionChange(index, oIndex, "score", e.target.value)} />
                      <button onClick={() => removeOption(index, oIndex)}>X</button>
                    </div>
                  ))}
                  <button onClick={() => addOption(index)}>+ Thêm lựa chọn</button>
                </div>
              )}
              <button onClick={() => removeQuestion(index)} style={{ marginTop: "8px" }}>🗑️ Xoá câu hỏi</button>
              <hr />
            </div>
          ))}
          <button onClick={addQuestion}>+ Thêm câu hỏi</button>
        </div>

        <div className="button-group">
          <button className="join-button" onClick={handleSaveEdit}>Lưu thay đổi</button>
          <button className="join-button cancel-button" onClick={onClose}>Hủy</button>
        </div>
      </motion.div>

      {isConfirmModalVisible && (
        <motion.div className="modal-overlay" onClick={handleCancelConfirm} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="modal-content" onClick={(e) => e.stopPropagation()} initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}>
            <h2>Xác nhận</h2>
            <p>Bạn có chắc chắn muốn lưu chiến dịch này?</p>
            <div className="button-group">
              <button onClick={handleConfirmSave}>Xác nhận</button>
              <button onClick={handleCancelConfirm}>Hủy</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EditCampaign;
