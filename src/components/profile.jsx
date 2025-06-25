import React, { useEffect, useState } from "react";
import "./cssCom/profile.css";

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [surveyHistory, setSurveyHistory] = useState([]);
    const [requestHistory, setRequestHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }

        // 1. Lấy thông tin hồ sơ
        fetch("http://localhost:8080/api/v1.0/profile", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Lỗi khi lấy profile");
                return res.json();
            })
            .then((data) => {
                setProfile(data);

                // 2. Lấy lịch sử khảo sát
                return fetch("http://localhost:8080/api/v1.0/survey-template/my", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
            })
            .then((res) => {
                if (!res.ok) throw new Error("Lỗi khi lấy lịch sử khảo sát");
                return res.json();
            })
            .then((history) => {
                setSurveyHistory(history);

                // 3. Lấy lịch sử yêu cầu làm lại khảo sát
                return fetch("http://localhost:8080/api/v1.0/my-requests/view-request-retake-survey", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
            })
            .then((res) => {
                if (!res.ok) throw new Error("Lỗi khi lấy lịch sử yêu cầu khảo sát");
                return res.json();
            })
            .then((requests) => {
                setRequestHistory(requests);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Lỗi khi tải dữ liệu:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="text-center mt-10">Đang tải...</div>;
    if (!profile) return <div className="text-center mt-10 text-red-500">Không có dữ liệu</div>;

    return (
        <div className="profile-container">
            <h2 className="tittle-thongtin">Thông tin cá nhân</h2>
            <ul className="thongtin">
                <li><strong>👤 Họ tên:</strong> {profile.fullName}</li>
                <li><strong>📧 Email:</strong> {profile.email}</li>
                <li><strong>🎂 Năm sinh:</strong> {profile.yob}</li>
                <li><strong>⚥ Giới tính:</strong> {profile.gender === "Male" ? "Nam" : "Nữ"}</li>
                <li><strong>📱 Số điện thoại:</strong> {profile.phone}</li>
                <li><strong>🛡️ Vai trò:</strong> {profile.roleName}</li>
                <li><strong>🔑 Đăng nhập bằng:</strong> {profile.authenticationProvider}</li>
            </ul>

            <button className="btn-back-home" onClick={() => (window.location.href = "/")}>
                🏠 Quay về trang chủ
            </button>

            {/* Hai cột song song: lịch sử khảo sát và yêu cầu */}
            <div className="history-columns">
                <div className="survey-history">
                    <h2 className="tittle-thongtin">📝 Lịch sử khảo sát</h2>
                    {surveyHistory.length === 0 ? (
                        <p>Không có bài khảo sát nào được thực hiện.</p>
                    ) : (
                        surveyHistory.map((survey) => (
                            <div key={survey.surveyId} className="survey-item">
                                <h3>{survey.surveyType} - {survey.status}</h3>
                                <p><strong>📅 Ngày làm:</strong> {survey.takenDate}</p>
                                <p><strong>🧮 Tổng điểm:</strong> {survey.totalScore}</p>
                                <p><strong>🩺 Đánh giá:</strong> {survey.recommendation || "Chưa có"}</p>
                                <details>
                                    <summary>📋 Xem chi tiết câu trả lời</summary>
                                    <ul>
                                        {survey.answers.map((ans) => (
                                            <li key={ans.questionId}>
                                                <strong>Câu {ans.questionId}:</strong> {ans.questionText}<br />
                                                <em>Trả lời:</em> {ans.answerText || "Chưa trả lời"} | <em>Điểm:</em> {ans.score}
                                            </li>
                                        ))}
                                    </ul>
                                </details>
                            </div>
                        ))
                    )}
                </div>

                <div className="request-history">
                    <h2 className="tittle-thongtin">📨 Lịch sử yêu cầu làm lại khảo sát</h2>
                    {requestHistory.length === 0 ? (
                        <p>Không có yêu cầu nào.</p>
                    ) : (
                        requestHistory.map((req) => (
                            <div key={req.id} className="request-item">
                                <p><strong>📄 Mã yêu cầu:</strong> {req.id}</p>
                                <p><strong>🗓 Ngày yêu cầu:</strong> {new Date(req.requestDate).toLocaleString()}</p>
                                <p><strong>🧾 Lý do:</strong> {req.reason}</p>
                                <p><strong>📌 Trạng thái:</strong> {req.status}</p>
                                {req.status === "REJECTED" && (
                                    <p><strong>❌ Lý do từ chối:</strong> {req.rejectionReason || "Không có"}</p>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
