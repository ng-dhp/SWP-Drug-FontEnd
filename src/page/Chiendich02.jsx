import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Chiendich02.css";

export default function Chiendich02() {
  const [campaign, setCampaign] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [serverMessage, setServerMessage] = useState("");
  const [totalScore, setTotalScore] = useState(null);
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();

  // Lấy userId
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn chưa đăng nhập hoặc thiếu token.");
      return;
    }

    fetch("http://localhost:8080/api/v1.0/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Không thể lấy thông tin người dùng.");
        return res.json();
      })
      .then(data => {
        if (data.userId) {
          setUserId(data.userId);
        } else {
          alert("Không tìm thấy userId trong profile.");
        }
      })
      .catch(error => {
        console.error("Lỗi khi lấy profile:", error);
        alert("Không thể lấy thông tin người dùng.");
      });
  }, []);

  // Lấy dữ liệu chiến dịch
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("http://localhost:8080/api/v1.0/campaigns/2", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Không thể tải chiến dịch.");
        return res.json();
      })
      .then(data => {
        setCampaign(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Lỗi khi tải chiến dịch:", error);
        alert("Không thể tải dữ liệu chiến dịch.");
        setLoading(false);
      });
  }, []);

  const handleChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Bạn chưa đăng nhập.");
      return;
    }

    if (!userId) {
      alert("Chưa xác định được userId. Vui lòng đợi tải xong hồ sơ.");
      return;
    }

    // ✅ Gửi toàn bộ answerText
    const payload = campaign.questions.map(q => ({
      questionId: q.id,
      answerText: answers[q.id] || ""
    }));

    // ✅ In ra console để kiểm tra
    console.log("📤 Payload gửi đi:", payload);
    fetch(`http://localhost:8080/api/v1.0/campaigns/2/submit?userId=${userId}`, {
      method: "POST",
      headers: {
"Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ answers: payload })
    })
      .then(res => res.json().then(data => ({ status: res.status, body: data })))
      .then(({ status, body }) => {
        const msg = body.message || "Gửi khảo sát thành công!";
        if (status >= 200 && status < 300) {
          setTotalScore(body.totalScore || null);
          setServerMessage(msg);
          setAnswers({});
          setTimeout(() => navigate("/chiendich"), 5000);
        } else {
          setIsError(true);
          setServerMessage(`🚨 ${msg}`);
        }
      })
      .catch(error => {
        console.error("Lỗi khi gửi khảo sát:", error);
        setIsError(true);
        setServerMessage("🚨 Lỗi kết nối hoặc server không phản hồi.");
      });
  };

  if (loading || userId === null) {
    return <div className="trang-tai-du-lieu">Đang tải dữ liệu...</div>;
  }

  if (!campaign) {
    return <div className="thong-bao">Không tìm thấy chiến dịch.</div>;
  }

  return (
    <>
      {serverMessage && (
        <div className="popup-thongbao">
          <div className="noi-dung-thongbao">
            <p>{serverMessage}</p>
            {totalScore !== null && (
              <p><strong>Điểm số của bạn:</strong> {totalScore}</p>
            )}
            <button onClick={() => {
              setServerMessage("");
              setTotalScore(null);
              setIsError(false);
              if (isError) navigate("/");
            }}>Đóng</button>
          </div>
        </div>
      )}

      <div className="trang-chien-dich">
        <div className="khung-chien-dich">
          <h1 className="tieu-de">{campaign.name}</h1>
          <p className="mo-ta"><strong>Thời gian:</strong> {campaign.startDate} - {campaign.endDate}</p>
          <p className="mo-ta"><strong>Mô tả:</strong> {campaign.description}</p>

          <form onSubmit={handleSubmit}>
            {campaign.questions.map((q, index) => (
              <div key={q.id} className="khung-cau-hoi">
                <label className="ten-cau-hoi">Câu {index + 1}: {q.content}</label>

                {q.type === "MULTIPLE_CHOICE" && (
                  <div className="lua-chon-tra-loi">
                    {q.options.map(option => (
                      <label key={option.id} className="muc-lua-chon">
                        <input
                          type="radio"
                          name={`question-${q.id}`}
                          value={option.text} // ✅ gửi option.text thay vì option.id
                          checked={answers[q.id] === option.text}
                          onChange={() => handleChange(q.id, option.text)}
                        />
                        <span>{option.text}</span>
                      </label>
                    ))}
                  </div>
                )}
{q.type === "TEXT" && (
                  <textarea
                    className="o-nhap-van-ban"
                    placeholder="Nhập câu trả lời..."
                    value={answers[q.id] || ""}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                  />
                )}
              </div>
            ))}

            <div className="khung-nut-gui">
              <button type="submit" className="nut-gui">
                Gửi khảo sát
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}