import React, { useEffect, useState } from "react";
import "./css/QuanLyChiendich.css";

const QuanLyChiendich = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  const fetchCampaigns = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/v1.0/campaigns/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Lỗi khi gọi API");

      const data = await res.json();
      setCampaigns(data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách chiến dịch:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCampaign = async (campaignId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/v1.0/campaigns/${campaignId}/toggle`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Không thể cập nhật trạng thái chiến dịch");

      await fetchCampaigns(); // Cập nhật lại danh sách
    } catch (err) {
      console.error("Lỗi khi toggle chiến dịch:", err);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="quanly-chiendich">
      <h2>Quản lý Chiến dịch Khảo sát</h2>
      {campaigns.length === 0 ? (
        <p>Không có chiến dịch nào.</p>
      ) : (
        <div className="campaign-list">
          {campaigns.map((camp) => (
            <div key={camp.id} className="campaign-card">
              <h3>{camp.name}</h3>
              <p><strong>Mô tả:</strong> {camp.description}</p>
              <p><strong>Thời gian:</strong> {camp.startDate} - {camp.endDate}</p>
              <p><strong>Trạng thái:</strong> {camp.active ? "🟢 Đang hoạt động" : "🔴 Tạm ngưng"}</p>
              <p><strong>Số lượng câu hỏi:</strong> {camp.questions.length}</p>
              <p><strong>Tỷ lệ cải thiện:</strong> {camp.successRatePercent}%</p>

              <button
                className={`toggle-btn ${camp.active ? "disable" : "enable"}`}
                onClick={() => toggleCampaign(camp.id)}
              >
                {camp.active ? "Tạm ngưng khảo sát" : "Kích hoạt khảo sát"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuanLyChiendich;
