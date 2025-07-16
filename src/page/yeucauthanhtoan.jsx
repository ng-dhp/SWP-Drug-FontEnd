import React, { useEffect, useState } from "react";
import "./css/YeucauThanhToan.css";

export default function YeucauThanhToan() {
    const [payments, setPayments] = useState([]);
    const [userMap, setUserMap] = useState({});
    const [courseMap, setCourseMap] = useState({});
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) return;

        const fetchAllData = async () => {
            try {
                const [paymentRes, userRes, courseRes] = await Promise.all([
                    fetch("http://localhost:8080/api/v1.0/payments/all", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch("http://localhost:8080/api/v1.0/profileAllUser", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch("http://localhost:8080/api/v1.0/khoahoc/getallcourse", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                const paymentsData = await paymentRes.json();
                const usersDataRaw = await userRes.json();
                const coursesDataRaw = await courseRes.json();

                console.log("📌 usersDataRaw:", usersDataRaw);
                console.log("📌 coursesDataRaw:", coursesDataRaw);

                const usersData = Array.isArray(usersDataRaw) ? usersDataRaw : (usersDataRaw.content || []);
                const coursesData = Array.isArray(coursesDataRaw) ? coursesDataRaw : (coursesDataRaw.content || []);


                const userMapData = {};
                usersData.forEach(u => {
                    userMapData[u.userId] = u.fullName;  
                });

                const courseMapData = {};
                coursesData.forEach(c => {
                    courseMapData[c.id] = c.tenKhoaHoc;
                });

                setPayments(Array.isArray(paymentsData) ? paymentsData : []);
                setUserMap(userMapData);
                setCourseMap(courseMapData);
                setLoading(false);
            } catch (err) {
                console.error("❌ Lỗi tải dữ liệu:", err);
                setLoading(false);
            }
        };

        fetchAllData();
    }, [token]);

    const handleMarkCompleted = (paymentId) => {
        fetch(`http://localhost:8080/api/v1.0/payments/${paymentId}/status?status=COMPLETED`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => {
                if (!res.ok) throw new Error("Không thể cập nhật trạng thái.");
                return res.text();
            })
            .then(msg => {
                alert(`✅ ${msg}`);
                setPayments(prev =>
                    prev.map(p =>
                        p.paymentId === paymentId ? { ...p, status: "COMPLETED" } : p
                    )
                );
            })
            .catch(err => {
                console.error("❌ Lỗi cập nhật trạng thái:", err);
                alert("❌ Cập nhật thất bại");
            });
    };

    if (loading) return <div className="text-center mt-10">Đang tải dữ liệu thanh toán...</div>;

    return (
        <div className="payment-request-container">
            <h2 className="text-2xl font-bold mb-4">📄 Danh sách yêu cầu thanh toán</h2>

            {payments.length === 0 ? (
                <p>Không có dữ liệu thanh toán nào.</p>
            ) : (
                <table className="payment-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Khóa học</th>
                            <th>Học viên</th>
                            <th>Ngày tạo</th>
                            <th>Số tiền</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map(payment => (
                            <tr key={payment.paymentId}>
                                <td>{payment.paymentId}</td>
                                <td>{courseMap[payment.courseId] || "Không rõ"}</td>
                                <td>{userMap[payment.userId] || "Không rõ"}</td>
                                <td>
                                    {payment.createdAt
                                        ? new Date(payment.createdAt).toLocaleString()
                                        : "N/A"}
                                </td>
                                <td>{payment.amount?.toLocaleString()} VNĐ</td>
                                <td>
                                    <span className={payment.status === "COMPLETED" ? "status-completed" : "status-pending"}>
                                        {payment.status}
                                    </span>
                                </td>
                                <td>
                                    {payment.status !== "COMPLETED" && (
                                        <button
                                            className="btn-confirm"
                                            onClick={() => handleMarkCompleted(payment.paymentId)}
                                        >
                                            ✅ Xác nhận đã thanh toán
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
