import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./css/DashBoardSurvey.css";

const DashboardSurvey = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [surveyData, setSurveyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1.0/admin/dashboard/getAll-surveys", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}` 
          },
        });

        if (!response.ok) {
          throw new Error("Không thể lấy dữ liệu khảo sát từ API");
        }

        const data = await response.json();
        setSurveyData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveyData();
  }, []);

  const filteredSurveys = surveyData.filter(survey =>
    survey.recommendation?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-survey-container">
      <h2 className="dashboard-survey-title">Dashboard Survey</h2>

      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <>
          <p className="dashboard-survey-participant-count">
            Tổng số khảo sát: {surveyData.length}
          </p>

          <div className="dashboard-survey-search-container">
            <input
              type="text"
              placeholder="Tìm theo nội dung khuyến nghị..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <ul className="dashboard-survey-user-list">
            {filteredSurveys.map((survey, index) => (
              <li key={index} className="dashboard-survey-user-item">
                <span><strong>Survey ID:</strong> {survey.surveyId}</span><br />
                <span><strong>Recommendation:</strong> {survey.recommendation}</span><br />
                <span><strong>Date:</strong> {survey.createdDate}</span>
                <Link
                  to={`/survey-detail/${survey.surveyId}`}
                  className="dashboard-survey-detail-button"
                >
                  Xem chi tiết
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <Link to="/dashboard" className="dashboard-survey-back-button">
        Quay lại trang chính
      </Link>
    </div>
  );
};

export default DashboardSurvey;
