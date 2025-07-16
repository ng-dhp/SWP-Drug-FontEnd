import React, { useEffect, useState } from "react";
import "./css/yeucauthanhtoan.css";

export default function XuLyThanhToan() {
    const [danhSachThanhToan, setDanhSachThanhToan] = useState([]);
    const [mapHocVien, setMapHocVien] = useState({});
    const [mapKhoaHoc, setMapKhoaHoc] = useState({});
    const [dangTai, setDangTai] = useState(true);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) return;

        const fetchDuLieu = async () => {
            try {
                const [resThanhToan, resNguoiDung, resKhoaHoc] = await Promise.all([
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

                const dataThanhToan = await resThanhToan.json();
                const duLieuNguoiDung = await resNguoiDung.json();
                const duLieuKhoaHoc = await resKhoaHoc.json();

                const danhSachNguoiDung = Array.isArray(duLieuNguoiDung) ? duLieuNguoiDung : duLieuNguoiDung.content || [];
                const danhSachKhoaHoc = Array.isArray(duLieuKhoaHoc) ? duLieuKhoaHoc : duLieuKhoaHoc.content || [];

                const mapHocVienTam = {};
                danhSachNguoiDung.forEach(u => {
                    mapHocVienTam[u.userId] = u.fullName;
                });

                const mapKhoaHocTam = {};
                danhSachKhoaHoc.forEach(k => {
                    mapKhoaHocTam[k.id] = k.tenKhoaHoc;
                });

                setDanhSachThanhToan(Array.isArray(dataThanhToan) ? dataThanhToan : []);
                setMapHocVien(mapHocVienTam);
                setMapKhoaHoc(mapKhoaHocTam);
                setDangTai(false);
            } catch (err) {
                console.error("❌ Lỗi khi tải dữ liệu:", err);
                setDangTai(false);
            }
        };

        fetchDuLieu();
    }, [token]);

    const xuLyXacNhan = (paymentId) => {
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
                setDanhSachThanhToan(prev =>
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

    if (dangTai) return <div className="dang-tai">Đang tải dữ liệu...</div>;

    return (
        <div className="khung-thanh-toan">
            <h2 className="tieu-de">📄 Danh sách yêu cầu thanh toán</h2>

            {danhSachThanhToan.length === 0 ? (
                <p>Không có dữ liệu thanh toán.</p>
            ) : (
                <table className="bang-thanh-toan">
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
                        {danhSachThanhToan.map(thanhToan => (
                            <tr key={thanhToan.paymentId}>
                                <td>{thanhToan.paymentId}</td>
                                <td>{mapKhoaHoc[thanhToan.courseId] || "Không rõ"}</td>
                                <td>{mapHocVien[thanhToan.userId] || "Không rõ"}</td>
                                <td>
                                    {thanhToan.createdAt
                                        ? new Date(thanhToan.createdAt).toLocaleString()
                                        : "N/A"}
                                </td>
                                <td>{thanhToan.amount?.toLocaleString()} VNĐ</td>
                                <td>
                                    <span className={thanhToan.status === "COMPLETED" ? "trang-thai-hoan-tat" : "trang-thai-cho"}>
                                        {thanhToan.status}
                                    </span>
                                </td>
                                <td>
                                    {thanhToan.status !== "COMPLETED" && (
                                        <button
                                            className="nut-xac-nhan"
                                            onClick={() => xuLyXacNhan(thanhToan.paymentId)}
                                        >
                                            ✅ Xác nhận thanh toán
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
