import React, { useState, useEffect } from "react";
import "./css/AssistSurvey.css";

const getOptions = (questionId) => {
  if (questionId === 1) {
    return [
      { label: "Thuốc lá", value: "tabaco" },
      { label: "Rượu", value: "alcohol" },
      { label: "Cần sa", value: "cannabis" },
      { label: "Cocaine", value: "cocaine" },
      { label: "Thuốc kích thích", value: "stimulants" },
      { label: "Thuốc an thần", value: "sedatives" },
      { label: "Chất hít", value: "inhalants" },
      { label: "Opioid", value: "opioids" },
      { label: "Khác", value: "other" },
    ];
  }

  if (questionId === 6 || questionId === 8) {
    return [
      { label: "Không", value: "NEVER" },
      { label: "Có, trong 3 tháng qua", value: "RECENT" },
      { label: "Có, nhưng không trong 3 tháng qua", value: "PAST" },
    ];
  }

  return [
    { label: "Không bao giờ", value: "NEVER" },
    { label: "1–2 lần", value: "1-2" },
    { label: "Hằng tháng", value: "MONTHLY" },
    { label: "Hằng tuần", value: "WEEKLY" },
    { label: "Gần như hàng ngày", value: "DAILY" },
  ];
};

function AssistSurvey() {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [surveyId, setSurveyId] = useState(null);
  const [fetchedQuestions, setFetchedQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const res = await fetch(
          "http://localhost:8080/api/v1.0/survey-template/start?templateId=1",
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
        setFetchedQuestions(data.answers);
      } catch (err) {
        console.error("Lỗi khi lấy khảo sát:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurvey();
  }, []);

  const handleAnswerChange = (qid, value) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const handleFinish = async () => {
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
        score: data.totalScore,
        risk: data.recommendation,
      });
    } catch (err) {
      console.error("Lỗi gửi khảo sát:", err);
    }
  };

  const handleReset = async () => {
    setAnswers({});
    setResult(null);
    setSurveyId(null);
    setFetchedQuestions([]);
    setIsLoading(true);

    try {
      const res = await fetch(
        "http://localhost:8080/api/v1.0/survey-template/start?templateId=1",
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
      setFetchedQuestions(data.answers);
    } catch (err) {
      console.error("Lỗi khi reset khảo sát:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="assist-survey-container">
      <div className="survey-box">
        <h2 className="question-title">Khảo sát ASSIST</h2>
        <p className="question-sub">
          Công cụ sàng lọc sử dụng chất gây nghiện cho người lớn (18+).
        </p>

        {isLoading ? (
          <p>Đang tải câu hỏi...</p>
        ) : !result ? (
          <>
            {fetchedQuestions.map((q) => (
              <div key={q.questionId} className="survey-question">
                <p>
                  <strong>
                    Câu {q.questionId} - {q.questionText}
                  </strong>
                </p>
                <div className="radio-group">
                  {getOptions(q.questionId).map((opt, idx) => (
                    <label key={idx} className="radio-item">
                      <input
                        type="radio"
                        name={`q${q.questionId}`}
                        value={opt.value}
                        checked={answers[q.questionId] === opt.value}
                        onChange={() =>
                          handleAnswerChange(q.questionId, opt.value)
                        }
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <button className="submit-button" onClick={handleFinish}>
              Gửi kết quả →
            </button>
          </>
        ) : (
          <div className="result-box">
            <h3>Kết quả đánh giá</h3>
            <p>
              <strong>Tổng điểm:</strong> {result.score}
            </p>
            <p>
              <strong>Mức độ nguy cơ:</strong> {result.risk}
            </p>
            {result.risk?.includes("cao") && (
              <p className="note warning">
                ⚠️ Bạn nên tìm tư vấn từ chuyên gia càng sớm càng tốt.
              </p>
            )}
            <br />
            <button
              className="tro-ve"
              onClick={() => (window.location.href = "/")}
            >
              🏠 Trở về màn hình chính
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AssistSurvey;
