import React, { useState, useEffect } from "react";
import "./css/AssistSurvey.css";

// Các lựa chọn cho từng câu hỏi
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

// Map giá trị thành nhãn tiếng Việt
const substanceMap = {
  tabaco: "Thuốc lá",
  alcohol: "Rượu",
  cannabis: "Cần sa",
  cocaine: "Cocaine",
  stimulants: "Thuốc kích thích",
  sedatives: "Thuốc an thần",
  inhalants: "Chất hít",
  opioids: "Opioid",
  other: "Khác",
};

const getSubstanceLabel = (value) => substanceMap[value] || value;

function AssistSurvey() {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [surveyId, setSurveyId] = useState(null);
  const [fetchedQuestions, setFetchedQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const selectedRiskySubstances = ["cocaine", "stimulants", "sedatives", "opioids"];

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
    if (qid === 1) {
      const selected = answers[1] || [];
      const newSelected = selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value];
      setAnswers((prev) => ({ ...prev, [1]: newSelected }));
    } else {
      setAnswers((prev) => ({ ...prev, [qid]: value }));
    }
  };
const handleFinish = async () => {
    const payload = {
      answers: [
        // 👉 Thêm câu 1 (danh sách chất đã chọn)
        ...(answers[1]
          ? [
              {
                questionId: 1,
                substance: null,
                answerText: answers[1].join(","),
              },
            ]
          : []),

        // 👉 Các câu còn lại
        ...Object.entries(answers)
          .filter(([key]) => key !== "1")
          .map(([questionKey, answerText]) => {
            const [questionId, substance] = questionKey.split("-");
            return {
              questionId: parseInt(questionId),
              substance: substance || null,
              answerText,
            };
          }),
      ],
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
            {fetchedQuestions.map((q) => {
              if (q.questionId === 1) {
                return (
                  <div key={q.questionId} className="survey-question">
                    <p>
                      <strong>
                        Câu {q.questionId} - {q.questionText}
                      </strong>
                    </p>
                    <div className="checkbox-group">
                      {getOptions(1).map((opt, idx) => (
<label key={idx} className="checkbox-item">
                          <input
                            type="checkbox"
                            name={`q${q.questionId}`}
                            value={opt.value}
                            checked={answers[1]?.includes(opt.value)}
                            onChange={() => handleAnswerChange(1, opt.value)}
                          />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                  </div>
                );
              }

              if (q.questionId !== 1 && answers[1]?.length > 0) {
                return answers[1].map((sub) => {
                  if (q.questionId === 8 && !selectedRiskySubstances.includes(sub))
                    return null;

                  return (
                    <div key={`${q.questionId}-${sub}`} className="survey-question">
                      <p>
                        <strong>
                          Câu {q.questionId} -{" "}
                          {q.questionText.replace(
                            "chất đó",
                            `chất ${getSubstanceLabel(sub)}`
                          )}
                        </strong>
                      </p>
                      <div className="radio-group">
                        {getOptions(q.questionId).map((opt, i) => (
                          <label key={i} className="radio-item">
                            <input
                              type="radio"
                              name={`q${q.questionId}-${sub}`}
                              value={opt.value}
                              checked={
                                answers[`${q.questionId}-${sub}`] === opt.value
                              }
                              onChange={() =>
                                handleAnswerChange(
                                  `${q.questionId}-${sub}`,
                                  opt.value
                                )
                              }
                            />
                            {opt.label}
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                });
              }

              return null;
            })}
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
            <button className="tro-ve" onClick={() => (window.location.href = "/")}>
              🏠 Trở về màn hình chính
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AssistSurvey;