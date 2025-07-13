import React, { useEffect, useState } from "react";
import "./css/Chiendich01.css";

const Chiendich01 = () => {
    const [campaign, setCampaign] = useState(null);
    const [answers, setAnswers] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const surveyCount = parseInt(localStorage.getItem("surveyCount") || "0");

        if (!token) {
            alert("Vui lòng đăng nhập trước.");
            window.location.href = "/login";
            return;
        }

        if (surveyCount >= 2) {
            alert("❗Bạn đã hoàn thành khảo sát trước và sau. Không thể làm thêm.");
            window.location.href = "/";
            return;
        }

        fetch("http://localhost:8080/api/v1.0/campaigns/2", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Lỗi khi gọi API");
                }
                return response.json();
            })
            .then((data) => setCampaign(data))
            .catch((error) =>
                console.error("Lỗi khi lấy dữ liệu chiến dịch:", error)
            );
    }, []);

    const handleChange = (questionId, value) => {
        setAnswers({ ...answers, [questionId]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Vui lòng đăng nhập trước.");
            window.location.href = "/login";
            return;
        }

        const missingAnswers = campaign.questions.filter(
            (q) => !answers[q.id] || answers[q.id].toString().trim() === ""
        );
        if (missingAnswers.length > 0) {
            alert("Vui lòng trả lời tất cả các câu hỏi trước khi gửi.");
            setIsSubmitting(false);
            return;
        }

        const formattedAnswers = Object.entries(answers).map(
            ([questionId, answerText]) => ({
                questionId: Number(questionId),
                answerText: answerText.toString(),
            })
        );

        fetch("http://localhost:8080/api/v1.0/campaigns/2/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ answers: formattedAnswers }),
        })
            .then(async (response) => {
                const contentType = response.headers.get("Content-Type");

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || "Gửi phản hồi thất bại.");
                }

                const resultText = await response.text();
                alert(resultText);

                // ✅ Cập nhật số lượt khảo sát
                const count = parseInt(localStorage.getItem("surveyCount") || "0");
                localStorage.setItem("surveyCount", count + 1);

                // 👉 Chuyển hướng sau khi gửi xong nếu muốn
                window.location.href = "/";
            })
            .catch((error) => {
                alert("Lỗi khi gửi phản hồi: " + error.message);
                console.error("Lỗi khi gửi phản hồi:", error);
            })
            .finally(() => setIsSubmitting(false));
    };

    if (!campaign) {
        return (
            <div className="trang-tai-du-lieu">
                <p className="thong-bao">Đang tải dữ liệu chiến dịch...</p>
            </div>
        );
    }

    return (
        <div className="trang-chien-dich">
            <div className="khung-chien-dich">
                <h1 className="tieu-de">{campaign.name}</h1>
                <p className="mo-ta">{campaign.description}</p>

                <form onSubmit={handleSubmit} className="bieu-mau-khao-sat">
                    {campaign.questions.map((q, index) => (
                        <div key={q.id} className="khung-cau-hoi">
                            <label className="ten-cau-hoi">
                                {index + 1}. {q.content}
                            </label>

                            {q.type === "MULTIPLE_CHOICE" ? (
                                <div className="lua-chon-tra-loi">
                                    {q.options.map((opt) => (
                                        <label key={opt.id} className="muc-lua-chon">
                                            <input
                                                type="radio"
                                                name={`question_${q.id}`}
                                                value={opt.text}
                                                checked={answers[q.id] === opt.text}
                                                onChange={(e) =>
                                                    handleChange(q.id, e.target.value)
                                                }
                                                className="o-chon"
                                            />
                                            <span className="noi-dung-lua-chon">{opt.text}</span>
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                <textarea
                                    className="o-nhap-van-ban"
                                    rows="4"
                                    placeholder="Nhập câu trả lời của bạn..."
                                    value={answers[q.id] || ""}
                                    onChange={(e) => handleChange(q.id, e.target.value)}
                                />
                            )}
                        </div>
                    ))}

                    <div className="khung-nut-gui">
                        <button type="submit" className="nut-gui" disabled={isSubmitting}>
                            {isSubmitting ? "Đang gửi..." : "Gửi phản hồi"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Chiendich01;
