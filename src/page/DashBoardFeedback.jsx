import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/DashBoardFeedback.css";

export default function DashBoardFeedback() {
  const [dsPhanHoi, setDsPhanHoi] = useState([]);
  const [dsTuVanVien, setDsTuVanVien] = useState([]);
  const [dsNguoiDung, setDsNguoiDung] = useState([]);
  const [loi, setLoi] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Lấy phản hồi
  useEffect(() => {
    fetch("http://localhost:8080/api/v1.0/feedback/consultant", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Không thể lấy phản hồi.");
        return res.json();
      })
      .then((data) => setDsPhanHoi(data))
      .catch((err) => {
        console.error("❌ Lỗi lấy phản hồi:", err);
        setLoi("Lỗi khi lấy danh sách phản hồi.");
      });
  }, []);

  // Lấy danh sách tư vấn viên
  useEffect(() => {
    fetch("http://localhost:8080/api/v1.0/consultant/getAllConsultant", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Không thể lấy danh sách tư vấn viên.");
        return res.json();
      })
      .then((data) => setDsTuVanVien(data))
      .catch((err) => console.error("❌ Lỗi lấy tư vấn viên:", err));
  }, []);

  // Lấy danh sách người dùng
  useEffect(() => {
    fetch("http://localhost:8080/api/v1.0/profileAllUser", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Không thể lấy danh sách người dùng.");
        return res.json();
      })
      .then((data) => setDsNguoiDung(data))
      .catch((err) => console.error("❌ Lỗi lấy người dùng:", err));
  }, []);

  // Tìm tên tư vấn viên từ ID
  const layTenTuVanVien = (id) => {
    const tv = dsTuVanVien.find((v) => v.consultantId === id);
    return tv ? tv.name : "Không rõ";
  };

  // Tìm tên người dùng từ ID
  const layTenNguoiDung = (id) => {
    const nguoi = dsNguoiDung.find((u) => u.userId === id);
    return nguoi ? nguoi.fullName : "Không rõ";
  };

  return (
    <div className="bao-cao-phan-hoi">
      <div className="header">
        <h2 className="tieu-de">Báo Cáo Phản Hồi Tư Vấn Viên</h2>
        <button className="quay-ve" onClick={() => navigate("/")}>
          ← Quay về Trang chủ
        </button>
      </div>

      {loi && <p className="loi">{loi}</p>}

      <div className="bang-phan-hoi">
        <table className="bang">
          <thead>
            <tr>
              <th>ID Phản Hồi</th>
              <th>Tên Người Dùng</th>
              <th>Tên Tư Vấn Viên</th>
              <th>Ngày Gửi</th>
              <th>Nội Dung</th>
            </tr>
          </thead>
          <tbody>
            {dsPhanHoi.map((item) => (
              <tr key={item.feedbackId}>
                <td>{item.feedbackId}</td>
                <td>{layTenNguoiDung(item.userId)}</td>
                <td>{layTenTuVanVien(item.consultantId)}</td>
                <td>{item.date}</td>
                <td>{item.content}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
