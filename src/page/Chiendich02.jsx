import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Chiendich02.css";

export default function Chiendich03() {
  const [campaign, setCampaign] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [serverMessage, setServerMessage] = useState("");
  const [totalScore, setTotalScore] = useState(null); // ✅ điểm số

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

    fetch("http://localhost:8080/api/v1.0/campaigns/3", {
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

    const payload = campaign.questions.map(q => ({
      questionId: q.id,
      answer: answers[q.id] || null
    }));

    // ✅ Tính điểm
    let score = 0;
    campaign.questions.forEach(q => {
      if (q.type === "MULTIPLE_CHOICE") {
        const selectedOptionId = answers[q.id];
        const selectedOption = q.options.find(opt => opt.id === selectedOptionId);
        if (selectedOption) {
          score += selectedOption.score || 0;
        }
      }
    });

    fetch(`http://localhost:8080/api/v1.0/campaigns/3/submit?userId=${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ answers: payload })
    })
      .then(res => res.json().then(data => ({ status: res.status, body: data })))
      .then(({ status, body }) => {
        if (status >= 200 && status < 300) {
          setTotalScore(score); // ✅ Hiển thị điểm
          setServerMessage(body.message || "Gửi khảo sát thành công!");
          setAnswers({});
          setTimeout(() => {
            navigate("/chiendich");
          }, 5000);
        } else {
          setServerMessage(body.message || "Gửi khảo sát thất bại!");
        }
      })
      .catch(error => {
        console.error("Lỗi khi gửi khảo sát:", error);
        setServerMessage("Lỗi kết nối hoặc server không phản hồi.");
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
      {/* Thông báo popup */}
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
                <label className="ten-cau-hoi">
                  Câu {index + 1}: {q.content}
                </label>

                {q.type === "MULTIPLE_CHOICE" && (
                  <div className="lua-chon-tra-loi">
                    {q.options.map(option => (
                      <label key={option.id} className="muc-lua-chon">
                        <input
                          type="radio"
                          className="o-chon"
                          name={`question-${q.id}`}
                          value={option.id}
                          checked={answers[q.id] === option.id}
                          onChange={() => handleChange(q.id, option.id)}
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
