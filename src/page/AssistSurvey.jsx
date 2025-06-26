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
  if (questionId === 6 || questionId === 7 || questionId === 8) {
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
  const [warningMessage, setWarningMessage] = useState(null);
  const [isStep1Done, setIsStep1Done] = useState(false);

  const selectedRiskySubstances = [
    "cocaine",
    "stimulants",
    "sedatives",
    "opioids",
  ];

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!result) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [result]);

  useEffect(() => {
    if (surveyId && fetchedQuestions.length > 0) {
      localStorage.setItem(
        "assistSurveyData",
        JSON.stringify({ surveyId, answers, fetchedQuestions })
      );
    }
  }, [surveyId, answers, fetchedQuestions]);

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
      const contentType = res.headers.get("content-type");
      if (!res.ok) {
        if (contentType && contentType.includes("text/plain")) {
          const message = await res.text();
          if (message.includes("7 ngày")) {
            setWarningMessage(
              "📅 Bạn chỉ có thể làm lại khảo sát này sau 7 ngày kể từ lần trước.\n\n🛠 Nếu bạn cho rằng mình đã trả lời sai, vui lòng liên hệ bộ phận hỗ trợ để được xem xét lại."
            );
          } else alert("⚠️ Lỗi từ server:\n" + message);
          return;
        }
        const errData = await res.json();
        alert("⚠️ Lỗi: " + (errData.message || "Không xác định."));
        return;
      }
      const data = await res.json();
      setSurveyId(data.surveyId);
      setFetchedQuestions(data.answers);
    } catch (err) {
      console.error("Lỗi khi lấy khảo sát:", err);
      alert(
        "❌ Không thể kết nối đến máy chủ hoặc server không phản hồi đúng định dạng."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("assistSurveyData");
    if (saved) {
      const { surveyId, answers, fetchedQuestions } = JSON.parse(saved);
      setSurveyId(surveyId);
      setAnswers(answers);
      setFetchedQuestions(fetchedQuestions);
      if (answers[1]) setIsStep1Done(true);
      setIsLoading(false);
    } else {
      fetchSurvey();
    }
  }, []);

  const handleAnswerChange = (qid, value) => {
    if (qid === 1) {
      setAnswers((prev) => ({ ...prev, [1]: value }));
      setIsStep1Done(true);
    } else {
      setAnswers((prev) => ({ ...prev, [qid]: value }));
    }
  };

  const handleFinish = async () => {
    const payload = {
      answers: [
        ...(answers[1]
          ? [{ questionId: 1, substance: null, answerText: answers[1] }]
          : []),
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
      setResult({ score: data.totalScore, risk: data.recommendation });
      localStorage.removeItem("assistSurveyData");
    } catch (err) {
      console.error("Lỗi gửi khảo sát:", err);
    }
  };

  return (
    <div className="assist-survey-container">
      <div className="survey-box">
        <h2 className="question-title">Khảo sát ASSIST</h2>

        {warningMessage ? (
          <div className="warning">
            {warningMessage.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
            <div className="button-group">
              <button
                className="back-home-button"
                onClick={() => (window.location.href = "/")}
              >
                🏠 Quay lại trang chủ
              </button>
              <button
                className="support-request-button"
                onClick={() => (window.location.href = "/guiyeucau")}
              >
                🛠 Gửi yêu cầu hỗ trợ
              </button>
            </div>
          </div>
        ) : (
          <p className="question-sub">
            Công cụ sàng lọc sử dụng chất gây nghiện cho người lớn (18+).
          </p>
        )}

        {isLoading ? (
          <p>Đang tải câu hỏi...</p>
        ) : !result && !warningMessage ? (
          <>
            {!isStep1Done &&
              fetchedQuestions
                .filter((q) => q.questionId === 1)
                .map((q) => (
                  <div key={q.questionId} className="survey-question">
                    <p>
                      <strong>
                        Câu {q.questionId} - {q.questionText}
                      </strong>
                    </p>
                    <div className="radio-group">
                      {getOptions(1).map((opt, idx) => (
                        <label key={idx} className="radio-item">
                          <input
                            type="radio"
                            name={`q${q.questionId}`}
                            value={opt.value}
                            checked={answers[1] === opt.value}
                            onChange={() => handleAnswerChange(1, opt.value)}
                          />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

            {isStep1Done &&
              fetchedQuestions
                .filter((q) => q.questionId !== 1)
                .map((q) => {
                  const sub = answers[1];
                  if (
                    q.questionId === 8 &&
                    !selectedRiskySubstances.includes(sub)
                  )
                    return null;
                  return (
                    <div
                      key={`${q.questionId}-${sub}`}
                      className="survey-question"
                    >
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
                })}

            {isStep1Done && (
              <div className="button-group">
                <button className="submit-button" onClick={handleFinish}>
                  Gửi kết quả →
                </button>
                <button
                  className="submit-button"
                  onClick={() => {
                    const sub = answers[1];
                    const newAnswers = { ...answers };
                    delete newAnswers[1];
                    Object.keys(newAnswers).forEach((key) => {
                      if (key.endsWith(`-${sub}`)) {
                        delete newAnswers[key];
                      }
                    });
                    setAnswers(newAnswers);
                    setIsStep1Done(false);
                  }}
                >
                  🔄 Chọn lại chất khác
                </button>
              </div>
            )}
          </>
        ) : result ? (
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
        ) : null}
      </div>
    </div>
  );
}

export default AssistSurvey;
