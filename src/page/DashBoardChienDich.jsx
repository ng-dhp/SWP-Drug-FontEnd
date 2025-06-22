import React from "react";
import { Link } from "react-router-dom";
import "./css/DashBoardChienDich.css";

const DashboardCampaign = () => {
  const campaignData = [
    { name: "Chung tay vì cộng đồng không ma túy", participants: 150 },
    { name: "Phòng chống ma túy tại trường học", participants: 95 },
    { name: "Hỗ trợ cai nghiện cộng đồng", participants: 120 },
    { name: "Nâng cao nhận thức gia đình", participants: 80 },
  ];

  return (
    <div className="dashboard-campaign-container">
      <h2>Dashboard Chiến dịch</h2>

      <ul className="campaign-list">
        {campaignData.map((campaign, index) => (
          <li key={index} className="campaign-item">
            <span><strong>Chiến dịch:</strong> {campaign.name}</span><br />
            <span><strong>Số lượng tham gia:</strong> {campaign.participants}</span>
            <Link to={`/campaign-detail/${campaign.name}`} className="campaign-detail-button">
              View Details
            </Link>
          </li>
        ))}
      </ul>

      <Link to="/dashboard" className="back-button">
        Back to Dashboard
      </Link>
    </div>
  );
};

export default DashboardCampaign;