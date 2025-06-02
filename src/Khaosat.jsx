import React, { useState } from "react";
import "./KhaoSat.css";

export default function KhaoSat() {
  const [activeSurvey, setActiveSurvey] = useState("ASSIST");

  const assistQuestions = [
    "1. Bạn đã bao giờ sử dụng rượu, bia hay chất gây nghiện khác chưa?",
    "2. Trong 3 tháng qua, bạn có sử dụng những chất đó không?",
    "3. Tần suất sử dụng chất gây nghiện trong 3 tháng qua như thế nào?",
    "4. Có khi nào bạn gặp vấn đề về sức khỏe hoặc xã hội do sử dụng chất không?",
  ];

  const craftQuestions = [
    "1. Bạn có bao giờ lên xe do người đã sử dụng chất gây nghiện lái chưa?",
    "2. Bạn có sử dụng chất gây nghiện để thư giãn, cảm thấy dễ chịu hơn không?",
    "3. Bạn có sử dụng chất khi ở một mình không?",
    "4. Bạn có bị bạn bè hoặc người thân khuyên nên giảm sử dụng chất chưa?",
  ];

  return (
    <div className="khaosat-container">
      <h1 className="khaosat-title">Khảo sát Đánh giá Nguy cơ</h1>
      <div className="survey-tabs">
        <button
          className={activeSurvey === "ASSIST" ? "active" : ""}
          onClick={() => setActiveSurvey("ASSIST")}
        >
          Khảo sát ASSIST
        </button>
        <button
          className={activeSurvey === "CRAFFT" ? "active" : ""}
          onClick={() => setActiveSurvey("CRAFFT")}
        >
          Khảo sát CRAFFT
        </button>
      </div>

      <div className="survey-form">
        {activeSurvey === "ASSIST" && (
          <div>
            <h2>Khảo sát ASSIST</h2>
            {assistQuestions.map((q, i) => (
              <div key={i} className="question-block">
                <label>{q}</label>
                <input type="text" placeholder="Nhập câu trả lời..." />
              </div>
            ))}
            <button className="submit-btn">Gửi kết quả</button>
          </div>
        )}

        {activeSurvey === "CRAFFT" && (
          <div>
            <h2>Khảo sát CRAFFT</h2>
            {craftQuestions.map((q, i) => (
              <div key={i} className="question-block">
                <label>{q}</label>
                <input type="text" placeholder="Nhập câu trả lời..." />
              </div>
            ))}
            <button className="submit-btn">Gửi kết quả</button>
          </div>
        )}
      </div>
    </div>
  );
}
