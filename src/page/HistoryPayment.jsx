import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../APIconfig"; 
import "./css/HistoryPayment.css";

export default function HistoryPayment() {
    const [paymentList, setPaymentList] = useState([]);
    const [courseMap, setCourseMap] = useState({});
    const navigate = useNavigate();

    const formatStatus = (status) => {
        switch (status) {
            case "PENDING":
                return "Đang xử lý";
            case "SUCCESS":
                return "Đã thanh toán";
            default:
                return status;
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        fetch(API.PROFILE, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((profile) => {
                const userId = profile.userId;

                // Lấy danh sách khóa học
                fetch(API.ALL_COURSES, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                    .then((res) => res.json())
                    .then((courses) => {
                        const map = {};
                        courses.forEach((course) => {
                            map[course.id] = course.courseName;
                        });
                        setCourseMap(map);

                        // Lấy tất cả payment
                        return fetch(API.PAYMENTS, {
                            headers: { Authorization: `Bearer ${token}` },
                        });
                    })
                    .then((res) => res.json())
                    .then((allPayments) => {
                        const filtered = (Array.isArray(allPayments) ? allPayments : []).filter(
                            (p) => p.userId === profile.userId
                        );
                        setPaymentList(filtered);
                    });
            })
            .catch((err) => {
                console.error("❌ Lỗi khi tải dữ liệu:", err);
                alert("Không thể tải lịch sử thanh toán.");
            });
    }, []);

    return (
        <div className="payment-history-page">
            <h2>🧾 Lịch sử thanh toán</h2>
            <button className="btn-back-home" onClick={() => navigate(-1)}>⬅️ Quay lại</button>

            {paymentList.length === 0 ? (
                <p>Không có giao dịch nào.</p>
            ) : (
                <ul>
                    {paymentList.map((payment) => (
                        <li key={payment.paymentId} className="payment-item">
                            <p><strong>🆔 Mã giao dịch:</strong> {payment.paymentId}</p>
                            <p><strong>📘 Khóa học:</strong> {courseMap[payment.courseId] || `ID ${payment.courseId}`}</p>
                            <p><strong>💵 Số tiền:</strong> {payment.amount.toLocaleString()} VND</p>
                            <p><strong>🏦 Phương thức:</strong> {payment.paymentMethod}</p>
                            <p><strong>📌 Trạng thái:</strong> {formatStatus(payment.status)}</p>
                            {payment.qrCodeUrl && (
                                <p>
                                    <strong>🔗 QR:</strong> <a href={payment.qrCodeUrl} target="_blank" rel="noopener noreferrer">Xem QR</a>
                                </p>
                            )}
                            {payment.message && (
                                <p><strong>📩 Ghi chú:</strong> {payment.message}</p>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
