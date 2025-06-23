import React, { useEffect, useState } from "react";
import "./css/CrafftSurvey.css";

function CrafftSurvey() {
  const [surveyId, setSurveyId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPartB, setShowPartB] = useState(false);

  // Gọi API lấy khảo sát CRAFFT
  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const res = await fetch(
          "http://localhost:8080/api/v1.0/survey-template/start?templateId=2",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await res.json();
        setSurveyId(data.surveyId);
        setQuestions(data.answers);
      } catch (err) {
        console.error("Lỗi tải khảo sát CRAFFT:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurvey();
  }, []);

  // Kiểm tra xem có câu nào trong phần A được chọn "YES"
  useEffect(() => {
    const hasYesInPartA = [9, 10, 11].some(
      (qid) => answers[qid] === "YES"
    );
    setShowPartB(hasYesInPartA);
  }, [answers]);

  const handleAnswerChange = (qid, value) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const handleSubmit = async () => {
    const payload = {
      answers: Object.entries(answers).map(([questionId, answerText]) => ({
        questionId: parseInt(questionId),
        answerText,
      })),
    };

    try {
      const res = await fetch(
        `http://localhost:8080/api/v1.0/survey-template/survey/${surveyId}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      setResult({
        totalScore: data.totalScore,
        recommendation: data.recommendation,
      });
    } catch (err) {
      console.error("Lỗi gửi khảo sát:", err);
    }
  };

  const handleReset = () => {
    window.location.reload();
  };

  return (
    <div className="the-khao-sat">
      <h2 className="tieu-de">Khảo sát CRAFFT</h2>
      <p className="tieu-de1">
        Công cụ sàng lọc sử dụng chất gây nghiện cho thanh thiếu niên (12–18 tuổi).
      </p>

      {isLoading ? (
        <p>Đang tải câu hỏi...</p>
      ) : result ? (
        <div className="result-box">
          <p className="tieu-de">Kết quả đánh giá:</p>
          <p><strong>Tổng điểm:</strong> {result.totalScore}</p>
          <p>
            <strong>Mức nguy cơ:</strong>{" "}
            <span className={result.totalScore >= 2 ? "nguy-co-cao" : "nguy-co-thap"}>
              {result.recommendation}
            </span>
          </p>
          <br />
          <button className="btn-tiep-theo" onClick={() => (window.location.href = "/")}>
            🏠 Trở về màn hình chính
          </button>
        </div>
      ) : (
        <>
          {/* Phần A */}
          <h3 className="tieu-de">Phần A: Trong 12 tháng qua</h3>
          {questions
            .filter((q) => [9, 10, 11].includes(q.questionId))
            .map((q) => (
              <div key={q.questionId} className="survey-question">
                <p><strong>{q.questionText}</strong></p>
                <div className="radio-group">
                  {["NEVER", "YES"].map((val) => (
                    <label key={val} className="radio-item">
                      <input
                        type="radio"
                        name={`q${q.questionId}`}
                        value={val}
                        checked={answers[q.questionId] === val}
                        onChange={() => handleAnswerChange(q.questionId, val)}
                      />
                      {val === "NEVER" ? "Không" : "Có"}
                    </label>
                  ))}
                </div>
              </div>
            ))}

          {/* Phần B */}
          {showPartB && (
            <>
              <h3 className="tieu-de">Phần B: Trong 12 tháng qua</h3>
              {questions
                .filter((q) => ![9, 10, 11].includes(q.questionId))
                .map((q) => (
                  <div key={q.questionId} className="survey-question">
                    <p><strong>{q.questionText}</strong></p>
                    <div className="radio-group">
                      {["NEVER", "YES"].map((val) => (
                        <label key={val} className="radio-item">
                          <input
                            type="radio"
                            name={`q${q.questionId}`}
                            value={val}
                            checked={answers[q.questionId] === val}
                            onChange={() => handleAnswerChange(q.questionId, val)}
                          />
                          {val === "NEVER" ? "Không" : "Có"}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

              <button className="submit-button" onClick={handleSubmit}>
                Gửi kết quả →
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default CrafftSurvey;
