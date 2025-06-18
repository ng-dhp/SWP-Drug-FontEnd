import React, { useState } from "react";
import "./css/AssistSurvey.css";

const substances = [
  { key: "tobacco", label: "1. Thuốc lá (cigarettes, xì gà, thuốc lào, v.v.)" },
  { key: "alcohol", label: "2. Rượu (bia, rượu vang, rượu mạnh, v.v.)" },
  { key: "cannabis", label: "3. Cần sa (marijuana, hashish, cần...)" },
  { key: "cocaine", label: "4. Cốc-ca-in (cocaine, crack)" },
  {
    key: "stimulants",
    label: "5. Thuốc kích thích (amphetamine, methamphetamine, ecstasy)",
  },
  {
    key: "sedatives",
    label: "6. Thuốc an thần, gây ngủ (valium, diazepam, zolpidem...)",
  },
  { key: "inhalants", label: "7. Chất hít (keo, xăng, sơn, khí gas...)" },
  {
    key: "opioids",
    label: "8. Heroin và các opioid khác (morphine, codeine...)",
  },
  { key: "other", label: "9. Khác" },
];

const questionList = [
  {
    id: 2,
    text: "Tần suất sử dụng gần đây",
    note: "Trong 3 tháng qua...",
    options: [
      "Không bao giờ",
      "1–2 lần",
      "Hằng tháng",
      "Hằng tuần",
      "Gần như hàng ngày",
    ],
  },
  {
    id: 3,
    text: "Cảm thấy thèm chất",
    options: [
      "Không bao giờ",
      "1–2 lần",
      "Hằng tháng",
      "Hằng tuần",
      "Gần như hàng ngày",
    ],
  },
  {
    id: 4,
    text: "Gặp vấn đề với việc kiểm soát",
    options: [
      "Không bao giờ",
      "1–2 lần",
      "Hằng tháng",
      "Hằng tuần",
      "Gần như hàng ngày",
    ],
  },
  {
    id: 5,
    text: "Gây ảnh hưởng đến trách nhiệm",
    options: [
      "Không bao giờ",
      "1–2 lần",
      "Hằng tháng",
      "Hằng tuần",
      "Gần như hàng ngày",
    ],
  },
  {
    id: 6,
    text: "Người khác lo ngại",
    options: [
      "Không",
      "Có, trong 3 tháng qua",
      "Có, nhưng không trong 3 tháng qua",
    ],
  },
  {
    id: 7,
    text: "Không thể ngừng dù không muốn",
    options: [
      "Không bao giờ",
      "1–2 lần",
      "Hằng tháng",
      "Hằng tuần",
      "Gần như hàng ngày",
    ],
  },
  {
    id: 8,
    text: "Tiêm chích",
    highlight: true,
    options: [
      "Không bao giờ",
      "Có, trong 3 tháng qua",
      "Có, nhưng không trong 3 tháng qua",
    ],
  },
];

const pointMap = {
  "Không bao giờ": 0,
  Không: 0,
  "1–2 lần": 2,
  "Hằng tháng": 3,
  "Hằng tuần": 4,
  "Có, trong 3 tháng qua": 6,
  "Gần như hàng ngày": 6,
  "Có, nhưng không trong 3 tháng qua": 2,
};

function AssistSurvey() {
  const [selectedSubstance, setSelectedSubstance] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const handleSelectSubstance = (key) => {
    setSelectedSubstance(key);
    setAnswers({});
    setResult(null);
  };

  const handleAnswerChange = (qid, value) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const calculateScore = () => {
    let total = 0;
    for (const q of questionList) {
      const ans = answers[q.id];
      total += pointMap[ans] || 0;
    }
    return total;
  };

  const getRiskLevel = (score) => {
    if (score <= 3) return "Nguy cơ thấp";
    if (score <= 26) return "Nguy cơ trung bình";
    return "Nguy cơ cao";
  };

  const handleFinish = () => {
    const score = calculateScore();
    const risk = getRiskLevel(score);
    setResult({ score, risk });
  };

  const handleReset = () => {
    setAnswers({});
    setResult(null);
    setSelectedSubstance(null);
  };

  return (
    <div className="assist-survey-container">
      <div className="survey-box">
        <h2 className="question-title">Khảo sát ASSIST</h2>
        <p className="question-sub">
          Công cụ sàng lọc sử dụng chất gây nghiện cho người lớn (18 tuổi trở
          lên).
        </p>

        {!selectedSubstance ? (
          <>
            <div className="step">Bước 1: Chọn chất đã sử dụng</div>
            <h2 className="question-title">Câu 1 - Đã từng sử dụng gì?</h2>
            <p className="question-sub">
              Trong suốt cuộc đời của bạn, bạn đã từng sử dụng các loại chất nào
              dưới đây (không tính dùng vì lý do y tế)?
              <br />
              <span className="note">(Chọn một chất để bắt đầu đánh giá)</span>
            </p>

            <div className="checkbox-list">
              {substances.map((sub) => (
                <button
                  key={sub.key}
                  className="substance-button"
                  onClick={() => handleSelectSubstance(sub.key)}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="step">Bước 2: Đánh giá mức độ sử dụng</div>
            <h2 className="question-title">
              Câu hỏi về:{" "}
              {substances.find((s) => s.key === selectedSubstance)?.label}
            </h2>

            {!result ? (
              <>
                {questionList.map((q) => (
                  <div
                    key={q.id}
                    className={`survey-question ${
                      q.highlight ? "highlight-question" : ""
                    }`}
                  >
                    <p>
                      <strong>
                        Câu {q.id} - {q.text}
                      </strong>
                    </p>
                    {q.note && <p className="note">{q.note}</p>}
                    <div className="radio-group">
                      {q.options.map((opt, idx) => (
                        <label key={idx} className="radio-item">
                          <input
                            type="radio"
                            name={`q${q.id}`}
                            value={opt}
                            checked={answers[q.id] === opt}
                            onChange={() => handleAnswerChange(q.id, opt)}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                <button className="submit-button" onClick={handleFinish}>
                  Hoàn thành →
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
                {result.risk === "Nguy cơ cao" && (
                  <p className="note warning">
                    ⚠️ Bạn nên tìm tư vấn từ chuyên gia càng sớm càng tốt.
                  </p>
                )}
                <button className="submit-button" onClick={handleReset}>
                  ← Trở về chọn chất khác
                </button>
                <br />
                <button
                  className="tro-ve"
                  onClick={() => (window.location.href = "/")}
                >
                  🏠 Trở về màn hình chính
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
