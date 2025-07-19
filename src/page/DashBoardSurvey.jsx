import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./css/DashBoardSurvey.css";

const DashboardSurvey = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [surveyData, setSurveyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detailData, setDetailData] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [errorDetail, setErrorDetail] = useState("");

  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/v1.0/admin/dashboard/getAll-surveys", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
        });
        if (!res.ok) throw new Error("Không thể lấy dữ liệu khảo sát từ API");
        const data = await res.json();
        setSurveyData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSurveyData();
  }, []);

  const translateStatus = (status) => {
    switch (status) {
      case "Completed":
        return "Hoàn thành";
      case "Pending":
        return "Đang chờ";
      case "Rejected":
        return "Bị từ chối";
      default:
        return status;
    }
  };

  const filteredSurveys = surveyData.filter(s =>
    s.recommendation?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showDetail = async (surveyId) => {
    setLoadingDetail(true);
    setErrorDetail("");
    try {
      const res = await fetch(`http://localhost:8080/api/v1.0/admin/dashboard/surveyDetail/${surveyId}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (!res.ok) throw new Error("Không thể lấy chi tiết khảo sát");
      const data = await res.json();
      setDetailData(data);
    } catch (err) {
      setErrorDetail(err.message);
    } finally {
      setLoadingDetail(false);
    }
  };

  const closeDetail = () => setDetailData(null);

  return (
    <div className="dashboard-survey-container">
      <h2 className="dashboard-survey-title">Báo Cáo Khảo Sát</h2>

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
            {filteredSurveys.map((survey, idx) => (
              <li key={idx} className="dashboard-survey-user-item">
                <span><strong>Mã khảo sát:</strong> {survey.surveyId}</span><br />
                <span><strong>Khuyến nghị:</strong> {survey.recommendation}</span><br />
                <span><strong>Ngày tạo:</strong> {survey.createdDate}</span>

                <button
                  className="dashboard-survey-detail-button"
                  onClick={() => showDetail(survey.surveyId)}
                >
                  Xem chi tiết
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      <Link to="/" className="dashboard-survey-back-button">
        Quay lại trang chủ
      </Link>

      {detailData && (
        <div className="modal-overlay">
          <div className="modal-content">
            {loadingDetail && <p>Đang tải chi tiết...</p>}
            {errorDetail && <p className="error">{errorDetail}</p>}
            {!loadingDetail && !errorDetail && (
              <>
                <h3>Khảo Sát #{detailData.surveyId} – {translateStatus(detailData.status)}</h3>
                <p><strong>Loại:</strong> {detailData.surveyType}</p>
                <p><strong>Ngày thực hiện:</strong> {detailData.takenDate}</p>
                <p><strong>Tổng điểm:</strong> {detailData.totalScore}</p>
                <p><strong>Khuyến nghị:</strong> {detailData.recommendation}</p>

                <h4>Thông tin người dùng</h4>
                <ul>
                  <li><strong>Họ và tên:</strong> {detailData.user.fullName}</li>
                  <li><strong>Email:</strong> {detailData.user.email}</li>
                  <li><strong>Năm sinh:</strong> {detailData.user.yob}</li>
                  <li><strong>Giới tính:</strong> {detailData.user.gender}</li>
                  <li><strong>Điện thoại:</strong> {detailData.user.phone}</li>
                  <li><strong>Vai trò:</strong> {detailData.user.roleName}</li>
                </ul>

                <h4>Các câu trả lời</h4>
                <ul>
                  {detailData.answers.map(ans => (
                    <li key={ans.questionId}>
                      <p><strong>Câu {ans.questionId}:</strong> {ans.questionText}</p>
                      <p><em>Trả lời:</em> {ans.answerText || "—"}</p>
                      <p><em>Điểm:</em> {ans.score}</p>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <button className="btn-close-detail" onClick={closeDetail}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardSurvey;
