import React, { useEffect, useState } from "react";
import "./css/CrafftSurvey.css";
import apiEndpoint from "../APIconfig";

function CrafftSurvey() {
  const [surveyId, setSurveyId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPartB, setShowPartB] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Ngăn reload mất dữ liệu
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!submitted && questions.length > 0) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [submitted, questions]);

  // Resume khảo sát nếu có localStorage
  useEffect(() => {
    const saved = localStorage.getItem("crafftSurveyData");
    if (saved) {
      const confirmResume = window.confirm("🔄 Bạn có một khảo sát CRAFFT đang làm dở. Tiếp tục không?");
      if (confirmResume) {
        const parsed = JSON.parse(saved);
        setSurveyId(parsed.surveyId);
        setQuestions(parsed.questions);
        setAnswers(parsed.answers || {});
        setIsLoading(false);
        return;
      } else {
        localStorage.removeItem("crafftSurveyData");
      }
    }
    fetchSurvey();
  }, []);

  // Kiểm tra điều kiện hiện phần B
  useEffect(() => {
    const show = [9, 10, 11].some((qid) => answers[qid] === "YES");
    setShowPartB(show);
  }, [answers]);

  // Lưu localStorage khi đang làm khảo sát
  useEffect(() => {
    if (!submitted && surveyId && questions.length > 0) {
      localStorage.setItem(
        "crafftSurveyData",
        JSON.stringify({ surveyId, questions, answers })
      );
    }
  }, [surveyId, questions, answers, submitted]);

  const fetchSurvey = async () => {
    try {
      const res = await fetch(apiEndpoint.START_CRAFFT_SURVEY(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const contentType = res.headers.get("content-type");

      if (!res.ok) {
        const msg = contentType?.includes("text")
          ? await res.text()
          : (await res.json())?.message || "Không rõ lỗi";

        if (msg.includes("7 ngày")) {
          setWarningMessage(
            "📅 Bạn chỉ có thể làm lại khảo sát này sau 7 ngày kể từ lần trước.\n\n🛠 Nếu bạn cho rằng mình đã trả lời sai, vui lòng liên hệ bộ phận hỗ trợ để được xem xét lại."
          );
        } else {
          setWarningMessage("⚠️ " + msg);
        }
        return;
      }

      const data = await res.json();
      setSurveyId(data.surveyId);
      setQuestions(data.answers);
    } catch (err) {
      console.error("Lỗi tải khảo sát CRAFFT:", err);
      setWarningMessage("❌ Không thể kết nối đến máy chủ.");
    } finally {
      setIsLoading(false);
    }
  };

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
      const res = await fetch(apiEndpoint.SUBMIT_CRAFFT_SURVEY(surveyId), {
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
          const msg = await res.text();
          if (msg.includes("Survey not found")) {
            alert("⚠️ Mã khảo sát không hợp lệ hoặc đã bị xóa. Trang sẽ được tải lại.");
            localStorage.removeItem("crafftSurveyData");
            window.location.reload();
            return;
          } else {
            alert("⚠️ Lỗi từ server:\n" + msg);
            return;
          }
        } else {
          const error = await res.json();
          alert("⚠️ Lỗi: " + (error.message || "Không xác định."));
          return;
        }
      }

      const data = await res.json();
      setResult({
        totalScore: data.totalScore,
        recommendation: data.recommendation,
      });
      setSubmitted(true);
      localStorage.removeItem("crafftSurveyData");
    } catch (err) {
      console.error("Lỗi gửi khảo sát:", err);
    }
  };

  return (
    <div className="assist-survey-container">
      <div className="survey-box">
        <h2 className="question-title">Khảo sát CRAFFT</h2>

        {warningMessage ? (
          <div className="warning">
            {warningMessage.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
            <button className="back-home-button" onClick={() => (window.location.href = "/")}>
              🏠 Quay lại trang chủ
            </button>
            <button className="support-request-button" onClick={() => (window.location.href = "/guiyeucaucrafft")}>
              🛠 Gửi yêu cầu hỗ trợ
            </button>
          </div>
        ) : (
          <p className="question-sub">
            Công cụ sàng lọc sử dụng chất gây nghiện cho thanh thiếu niên (12–18 tuổi).
          </p>
        )}

        {isLoading ? (
          <p>Đang tải câu hỏi...</p>
        ) : warningMessage ? null : result ? (
          <div className="result-box">
            <h3>Kết quả đánh giá</h3>
            <p><strong>Tổng điểm:</strong> {result.totalScore}</p>
            <p>
              <strong>Mức nguy cơ:</strong>{" "}
              <span className={result.totalScore >= 2 ? "nguy-co-cao" : "nguy-co-thap"}>
                {result.recommendation}
              </span>
            </p>
            {result.totalScore >= 2 && (
              <p className="note warning">
                ⚠️ Bạn nên tìm tư vấn từ chuyên gia càng sớm càng tốt.
              </p>
            )}
            <button className="tro-ve" onClick={() => (window.location.href = "/")}>
              🏠 Trở về màn hình chính
            </button>
          </div>
        ) : (
          <>
            <h3 className="tieu-de">Phần A: Trong 12 tháng qua</h3>
            {questions.filter((q) => [9, 10, 11].includes(q.questionId)).map((q) => (
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

            {showPartB && (
              <>
                <h3 className="tieu-de">Phần B: Trong 12 tháng qua</h3>
                {questions.filter((q) => ![9, 10, 11].includes(q.questionId)).map((q) => (
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
    </div>
  );
}

export default CrafftSurvey;
