import React, { useEffect, useState } from "react";
import "./css/SurveyTemplateManager.css";

const SurveyTemplateManager = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:8080/api/v1.0/admin/dashboard/getAll-templates-admin",
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Lỗi khi fetch templates");
      }

      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error("❌ Lỗi lấy templates:", error);
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const toggleActive = async (templateId, currentActive) => {
    const token = localStorage.getItem("token");

    try {
      await fetch(
        `http://localhost:8080/api/v1.0/admin/dashboard/template-toggle/${templateId}`,
        {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ active: !currentActive }),
        }
      );
      fetchTemplates();
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật trạng thái:", error);
    }
  };

  if (loading) return <p>Đang tải danh sách khảo sát...</p>;

  return (
    <div className="quanly-khaosat">
      <h2 className="tieu-de">Quản lý khảo sát</h2>
      {templates.map((template) => (
        <div key={template.templateId} className="khung-khaosat">
          <div className="noi-dung-khaosat">
            <h3 className="ten-khaosat">{template.name}</h3>
            <p className="mo-ta">{template.description}</p>
            <p>Loại: {template.surveyType}</p>
            <p>
              Nhóm tuổi: {template.ageGroup} | Giới tính: {template.genderGroup}
            </p>
            <p>Rủi ro: {template.riskLevel}</p>
            <p>
              Trạng thái:{" "}
              <span className={template.active ? "trangthai-hoatdong" : "trangthai-ngung"}>
                {template.active ? "Đang hoạt động" : "Ngưng hoạt động"}
              </span>
            </p>
          </div>
          <button
            onClick={() => toggleActive(template.templateId, template.active)}
            className={`nut-chucnang ${
              template.active ? "nut-ngung" : "nut-kichhoat"
            }`}
          >
            {template.active ? "Ngưng hoạt động" : "Kích hoạt"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default SurveyTemplateManager;
