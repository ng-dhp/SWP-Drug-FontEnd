import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./css/DashBoardSurvey.css";

const DashboardSurvey = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [surveyData] = useState([
    { name: "Nguyen Van A", score: 20, date: "2025-06-15" },
    { name: "Tran Thi B", score: 25, date: "2025-06-16" },
    { name: "Le Van C", score: 15, date: "2025-06-17" },
    { name: "Pham Thi D", score: 27, date: "2025-06-18" },
  ]);

  const participantCount = surveyData.length;
  const filteredUsers = surveyData.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <h2>Dashboard Survey</h2>
      <p className="participant-count">Total Participants: {participantCount}</p>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by user name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <ul className="user-list">
        {filteredUsers.map((user, index) => (
          <li key={index} className="user-item">
            <span><strong>Name:</strong> {user.name}</span><br />
            <span><strong>Score:</strong> {user.score} / 27</span><br />
            <span><strong>Date:</strong> {user.date}</span>
          </li>
        ))}
      </ul>

      <Link to="/dashboard" className="back-button">
        Back to Dashboard
      </Link>
    </div>
  );
};

export default DashboardSurvey;