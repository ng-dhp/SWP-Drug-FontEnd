import React from "react";
import { Link } from "react-router-dom";
import "./css/DashBoard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard</h2>
      <div className="link-container">
        <Link to="/dashboard-survey" className="dashboard-link">Go to Survey Statistics</Link>
      </div>
      <div className="link-container">
        <Link to="/dashboard-campaign" className="dashboard-link">Go to Campaign Statistics</Link>
      </div>
    </div>
  );
};

export default Dashboard;