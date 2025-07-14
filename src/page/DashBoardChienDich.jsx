import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "./css/DashBoardChienDich.css";

const DashboardCampaign = () => {
  const [campaignStats, setCampaignStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/api/v1.0/campaigns/1", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Lỗi khi gọi API");
        }
        return response.json();
      })
      .then((data) => {
        const { improveCount, noImproveCount, successRatePercent } = data;
        setCampaignStats({ improveCount, noImproveCount, successRatePercent });
      })
      .catch((error) => {
        console.error("Lỗi khi tải dữ liệu chiến dịch:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Đang tải dữ liệu chiến dịch...</div>;
  }

  if (!campaignStats) {
    return <div>Không có dữ liệu chiến dịch.</div>;
  }

  // Chuẩn bị dữ liệu cho PieChart
  const pieData = [
    { name: "Cải thiện", value: campaignStats.improveCount },
    { name: "Không cải thiện", value: campaignStats.noImproveCount }
  ];

  const COLORS = ["#00C49F", "#FF8042"];

  return (
    <div className="dashboard-campaign-container">
      <h2>Dashboard Chiến dịch</h2>

      <div className="pie-chart-wrapper">
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
      </div>

      <div className="text-stats">
        <p><strong>Số người cải thiện:</strong> {campaignStats.improveCount}</p>
        <p><strong>Số người không cải thiện:</strong> {campaignStats.noImproveCount}</p>
        <p><strong>Tỷ lệ thành công (%):</strong> {campaignStats.successRatePercent}</p>
      </div>

      <Link to="/" className="back-button">
        Quay lại trang chủ
      </Link>
    </div>
  );
};

export default DashboardCampaign;
