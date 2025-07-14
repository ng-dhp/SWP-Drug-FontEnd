import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "./css/DashBoardChienDich.css";

const DashboardCampaign = () => {
  const [campaign1, setCampaign1] = useState(null);
  const [campaign2, setCampaign2] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:8080/api/v1.0/campaigns/1", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }).then((res) => res.ok ? res.json() : Promise.reject("Lỗi chiến dịch 1")),
      fetch("http://localhost:8080/api/v1.0/campaigns/2", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }).then((res) => res.ok ? res.json() : Promise.reject("Lỗi chiến dịch 2")),
    ])
      .then(([data1, data2]) => {
        setCampaign1(data1);
        setCampaign2(data2);
      })
      .catch((error) => {
        console.error("Lỗi khi tải dữ liệu:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  const COLORS = ["#00C49F", "#FF8042"];

  const renderPieChart = (data, title) => {
    const pieData = [
      { name: "Cải thiện", value: data.improveCount },
      { name: "Không cải thiện", value: data.noImproveCount }
    ];

    return (
      <div className="campaign-section">
        <h3>{title}</h3>
        <PieChart width={400} height={300}>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
        <div className="text-stats">
          <p><strong>Số người cải thiện:</strong> {data.improveCount}</p>
          <p><strong>Số người không cải thiện:</strong> {data.noImproveCount}</p>
          <p><strong>Tỷ lệ thành công (%):</strong> {data.successRatePercent}</p>
        </div>
      </div>
    );
  };

  if (loading) return <div>Đang tải dữ liệu chiến dịch...</div>;

  if (!campaign1 || !campaign2) return <div>Không có đủ dữ liệu để hiển thị.</div>;

  return (
    <div className="dashboard-campaign-container">
      <h2>Dashboard 2 Chiến dịch</h2>
      <div className="campaigns-wrapper">
        {renderPieChart(campaign1, "Chiến dịch 1")}
        {renderPieChart(campaign2, "Chiến dịch 2")}
      </div>

      <Link to="/" className="back-button">
        Quay lại trang chủ
      </Link>
    </div>
  );
};

export default DashboardCampaign;
