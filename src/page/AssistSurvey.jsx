import React, { useState, useEffect } from "react";
import "./css/AssistSurvey.css";
import API_ENDPOINTS from "../APIconfig";

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
  if ([6, 7, 8].includes(questionId)) {
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
  const [surveyId, setSurveyId] = useState(null);
  const [fetchedQuestions, setFetchedQuestions] = useState([]);
  const [isStep1Done, setIsStep1Done] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [warningMessage, setWarningMessage] = useState(null);
  const [result, setResult] = useState(null);

  const riskySubstances = ["cocaine", "stimulants", "sedatives", "opioids"];

  useEffect(() => {
    const saved = localStorage.getItem("assistSurveyData");
    if (saved) {
      const { surveyId, answers, fetchedQuestions } = JSON.parse(saved);
      setSurveyId(surveyId);
      setAnswers(answers);
      setFetchedQuestions(fetchedQuestions);
      setIsStep1Done(!!answers[1]);
      setIsLoading(false);
    } else {
      fetchSurvey();
    }

    const beforeUnload = (e) => {
      if (!result) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, []);

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
      const res = await fetch(API_ENDPOINTS.START_ASSIST_SURVEY(1), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const contentType = res.headers.get("content-type");
      if (!res.ok) {
        if (contentType?.includes("text/plain")) {
          const message = await res.text();
          if (message.includes("7 ngày")) {
            setWarningMessage(
              "📅 Bạn chỉ có thể làm lại khảo sát này sau 7 ngày kể từ lần trước.\n\n🛠 Nếu bạn cho rằng mình đã trả lời sai, vui lòng liên hệ bộ phận hỗ trợ để được xem xét lại."
            );
          } else {
            alert("⚠️ Server trả về lỗi:\n" + message);
          }
        } else {
          const err = await res.json();
          alert("⚠️ Lỗi: " + (err.message || "Không xác định."));
        }
        return;
      }

      const data = await res.json();
      setSurveyId(data.surveyId);
      setFetchedQuestions(data.answers);
    } catch (err) {
      alert("❌ Không thể kết nối đến máy chủ.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (qid, value) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
    if (qid === 1) setIsStep1Done(true);
  };

  const handleFinish = async () => {
    if (!surveyId) {
      alert("❌ Không tìm thấy mã khảo sát (surveyId). Vui lòng tải lại trang.");
      return;
    }

    const payload = {
      answers: [
        ...(answers[1]
          ? [{ questionId: 1, substance: null, answerText: answers[1] }]
          : []),
        ...Object.entries(answers)
          .filter(([k]) => k !== "1")
          .map(([key, value]) => {
            const [questionId, substance] = key.split("-");
            return {
              questionId: parseInt(questionId),
              substance: substance || null,
              answerText: value,
            };
          }),
      ],
    };

    try {
      const res = await fetch(API_ENDPOINTS.SUBMIT_ASSIST_SURVEY(surveyId), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get("content-type");
      if (!res.ok) {
        if (contentType?.includes("text/plain")) {
          const message = await res.text();
          if (message.includes("Survey not found")) {
            localStorage.removeItem("assistSurveyData");
            alert("⚠️ Mã khảo sát không hợp lệ hoặc đã bị xóa.\nTrang sẽ được tải lại.");
            window.location.reload();
          } else {
            alert("⚠️ Lỗi từ server:\n" + message);
          }
        } else {
          const error = await res.json();
          alert("⚠️ Lỗi: " + (error.message || "Không xác định."));
        }
        return;
      }

      const data = await res.json();
      setResult({ score: data.totalScore, risk: data.recommendation });
      localStorage.removeItem("assistSurveyData");
    } catch (err) {
      alert("❌ Gửi khảo sát thất bại.");
      console.error("Lỗi gửi khảo sát:", err);
    }
  };

  const selectedSubstance = answers[1];

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
              <button onClick={() => (window.location.href = "/")}>🏠 Trang chủ</button>
              <button onClick={() => (window.location.href = "/guiyeucau")}>🛠 Gửi yêu cầu</button>
            </div>
          </div>
        ) : isLoading ? (
          <p>Đang tải câu hỏi...</p>
        ) : result ? (
          <div className="result-box">
            <h3>Kết quả đánh giá</h3>
            <p><strong>Tổng điểm:</strong> {result.score}</p>
            <p><strong>Mức độ nguy cơ:</strong> {result.risk}</p>
            {result.risk?.includes("cao") && (
              <p className="note warning">⚠️ Bạn nên tìm tư vấn chuyên gia càng sớm càng tốt.</p>
            )}
            <button onClick={() => (window.location.href = "/")}>🏠 Trở về</button>
          </div>
        ) : (
          <>
            {!isStep1Done &&
              fetchedQuestions
                .filter((q) => q.questionId === 1)
                .map((q) => (
                  <div key={q.questionId} className="survey-question">
                    <p><strong>Câu {q.questionId} - {q.questionText}</strong></p>
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
                  if (q.questionId === 8 && !riskySubstances.includes(selectedSubstance)) return null;
                  return (
                    <div key={`${q.questionId}-${selectedSubstance}`} className="survey-question">
                      <p><strong>
                        Câu {q.questionId} - {q.questionText.replace("chất đó", `chất ${getSubstanceLabel(selectedSubstance)}`)}
                      </strong></p>
                      <div className="radio-group">
                        {getOptions(q.questionId).map((opt, idx) => (
                          <label key={idx} className="radio-item">
                            <input
                              type="radio"
                              name={`q${q.questionId}-${selectedSubstance}`}
                              value={opt.value}
                              checked={answers[`${q.questionId}-${selectedSubstance}`] === opt.value}
                              onChange={() => handleAnswerChange(`${q.questionId}-${selectedSubstance}`, opt.value)}
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
                <button className="submit-button" onClick={handleFinish}>Gửi kết quả →</button>
                <button
                  onClick={() => {
                    const sub = answers[1];
                    const newAnswers = { ...answers };
                    delete newAnswers[1];
                    Object.keys(newAnswers).forEach((key) => {
                      if (key.endsWith(`-${sub}`)) delete newAnswers[key];
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
        )}
      </div>
    </div>
  );
}

export default AssistSurvey;