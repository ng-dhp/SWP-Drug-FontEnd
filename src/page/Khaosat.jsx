import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import AssistSurvey from "./AssistSurvey";
import CrafftSurvey from "./CrafftSurvey";
<<<<<<< HEAD
import "./css/Khaosat.css"; // Import CSS styles
=======
import "./css/Khaosat.css";
import anh_assist from "../assets/anh_assist.png";
import anh_crafft from "../assets/anh_crafft.png";
>>>>>>> Long

export default function KhaoSat() {
  return (
    <div className="wrapper">
      {/* Header */}
      <div className="header">
        <div className="header-title">Hệ thống Hỗ trợ Phòng ngừa Sử dụng Ma túy</div>
      </div>

      <main className="main-content">
        <Routes>
          {/* Trang chính */}
          <Route
            path="/"
            element={
              <div className="Khao-sat">
                <h2>Khảo Sát Đánh Giá Nguy Cơ</h2>
                <p className="intro-text">
                  Chào mừng bạn đến với hệ thống khảo sát đánh giá nguy cơ sử dụng ma túy. Khảo sát này giúp bạn hiểu rõ hơn về mức độ nguy cơ và nhận được những hỗ trợ phù hợp.
                </p>
                <p className="note">
                  <i>Thông tin của bạn sẽ được bảo mật và chỉ sử dụng cho mục đích hỗ trợ.</i>
                </p>

                <div className="survey-cards">
                  {/* ASSIST */}
                  <div className="survey-card">
<<<<<<< HEAD
                    <img src="/assets/assist.png" alt="Khảo sát ASSIST" className="survey-image" />
                    <h3>ASSIST</h3>
                    <p><strong>Đối tượng:</strong> Người trưởng thành (18 tuổi trở lên)</p>
                    <p><strong>Thời gian:</strong> Khoảng 5-7 phút</p>
                    <p className="description">
                      Bài khảo sát theo tiêu chuẩn quốc tế dành cho người trưởng thành, đánh giá mức độ nguy cơ liên quan đến việc sử dụng các chất gây nghiện.
                    </p>
                    <Link to="assist"><button className="start-button">📋 Bắt đầu</button></Link>
=======
                    <img src={anh_assist} alt="Khảo sát ASSIST" className="survey-image-top" />
                    <h3>ASSIST</h3>
                    <div className="survey-details">
                      <p className="survey-summary">
                        Dành cho người lớn (22 tuổi trở lên). Đánh giá chi tiết việc sử dụng các chất và mức độ rủi ro.
                      </p>
                      <ul className="survey-features blue">
                        <li>8 câu hỏi cho mỗi chất</li>
                        <li>Đánh giá mức độ nguy cơ chi tiết</li>
                        <li>Gợi ý can thiệp phù hợp</li>
                      </ul>
                    </div>
                    <Link to="assist">
                      <button className="start-button">📋 Bắt đầu</button>
                    </Link>
>>>>>>> Long
                  </div>

                  {/* CRAFFT */}
                  <div className="survey-card">
<<<<<<< HEAD
                    <img src="/assets/craft.png" alt="Khảo sát CRAFFT" className="survey-image" />
                    <h3>CRAFFT</h3>
                    <p><strong>Đối tượng:</strong> Thanh thiếu niên (12–17 tuổi)</p>
                    <p><strong>Thời gian:</strong> Khoảng 3-5 phút</p>
                    <p className="description">
                      Bài khảo sát được thiết kế đặc biệt cho thanh thiếu niên, giúp phát hiện sớm các hành vi nguy cơ liên quan đến sử dụng chất gây nghiện.
                    </p>
                    <Link to="crafft"><button className="start-button">📋 Bắt đầu</button></Link>
=======
                    <img src={anh_crafft} alt="Khảo sát CRAFFT" className="survey-image-top" />
                    <h3>CRAFFT</h3>
                    <div className="survey-details">
                      <p className="survey-summary">
                        Dành cho thanh thiếu niên (12–21 tuổi). Sàng lọc nhanh và hiệu quả việc sử dụng chất.
                      </p>
                      <ul className="survey-features purple">
                        <li>6 câu hỏi chính</li>
                        <li>Phù hợp với thanh thiếu niên</li>
                        <li>Kết quả nhanh chóng</li>
                      </ul>
                    </div>
                    <Link to="crafft">
                      <button className="start-button">📋 Bắt đầu</button>
                    </Link>
>>>>>>> Long
                  </div>
                </div>
              </div>
            }
          />

          {/* Trang khảo sát riêng */}
          <Route path="assist" element={<AssistSurvey />} />
          <Route path="crafft" element={<CrafftSurvey />} />
        </Routes>
      </main>

      <footer className="footer">
        © 2025 Hệ thống Hỗ trợ Phòng ngừa Sử dụng Ma túy<br />
        <small>Thông tin trên trang web này chỉ mang tính chất tham khảo và không thay thế cho tư vấn y tế chuyên nghiệp.</small>
      </footer>
    </div>
  );
}
