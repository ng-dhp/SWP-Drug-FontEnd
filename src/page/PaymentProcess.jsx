import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./css/PaymentProcess.css";


export default function PaymentProcess() {
    const location = useLocation();
    const { courseId, userId, amount } = location.state || {};
    const token = localStorage.getItem("token");

    const [fullName, setFullName] = useState("");
    const [tenKhoaHoc, setTenKhoaHoc] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("Đang kiểm tra...");

    // ✅ Lấy tên người dùng
    useEffect(() => {
        if (!token) return;
        fetch("http://localhost:8080/api/v1.0/profile", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => setFullName(data.fullName || ""))
            .catch(err => console.error("Lỗi lấy profile:", err));
    }, [token]);

    // ✅ Lấy tên khóa học
    useEffect(() => {
        if (!token || !courseId) return;
        fetch("http://localhost:8080/api/v1.0/khoahoc/getallcourse", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => {
                const khoaHoc = data.find(kh => kh.id === courseId);
                if (khoaHoc) setTenKhoaHoc(khoaHoc.tenKhoaHoc);
            })
            .catch(err => console.error("Lỗi lấy danh sách khóa học:", err));
    }, [token, courseId]);

    // ✅ Lấy trạng thái thanh toán và ánh xạ status
    useEffect(() => {
        if (!token || !courseId || !userId) return;

        console.log("🔍 Kiểm tra thanh toán cho:");
        console.log("👉 courseId:", courseId, "userId:", userId);

        fetch("http://localhost:8080/api/v1.0/payments/all", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => {
                console.log("📦 Dữ liệu thanh toán trả về:", data);

                // So sánh ép kiểu để tránh lỗi string/number
                const payment = data.find(
                    (p) => p.userId === +userId && p.amount === +amount
                );

                if (payment) {
                    console.log("✅ Giao dịch tìm thấy:", payment);
                    const statusText = payment.status?.toUpperCase() === "COMPLETED"
                        ? "Đã thanh toán"
                        : "Chưa thanh toán";

                    setPaymentStatus(statusText);
                } else {
                    console.warn("⚠️ Không tìm thấy giao dịch phù hợp");
                    setPaymentStatus("Chưa thanh toán");
                }
            })
            .catch(err => {
                console.error("❌ Lỗi khi gọi API thanh toán:", err);
                setPaymentStatus("Lỗi khi kiểm tra");
            });
    }, [token, courseId, userId]);

    return (
        <div className="payment-container">
            <h2>Thanh toán khóa học</h2>
            <div className="payment-info">
                <p>👤 Học viên: <strong>{fullName || "..."}</strong></p>
                <p>📘 Khóa học: <strong>{tenKhoaHoc || "..."}</strong></p>
                <p>💵 Số tiền: <strong>{amount?.toLocaleString()} VNĐ</strong></p>
                <p className={`payment-status ${paymentStatus === "Đã thanh toán"
                        ? "success"
                        : paymentStatus === "Chưa thanh toán"
                            ? "pending"
                            : "error"
                    }`}>
                    📋 Trạng thái thanh toán: {paymentStatus}
                </p>
            </div>

            <img
                src={`https://img.vietqr.io/image/TPB-0339604456-compact.png?amount=${amount}&addInfo=THANH%20TOAN%20KHOA%20HOC&accountName=${encodeURIComponent(fullName || "NGUYEN DUC DUY")}`}
                alt="QR Thanh toán"
                className="qr-image"
            />
        </div>
    );

}
