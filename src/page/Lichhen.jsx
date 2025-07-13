import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./css/lichhen.css";

export default function Lichhen() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editStatus, setEditStatus] = useState({});
  const [users, setUsers] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [consultantId, setConsultantId] = useState(null);

  useEffect(() => {
    loadUsers();
    loadConsultantsAndAppointments();
  }, []);

  const loadUsers = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:8080/api/v1.0/profileAllUser", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          console.log("📌 Danh sách users:", data);
          setUsers(data);
        }
      })
      .catch((err) => {
        console.error("❌ Lỗi lấy danh sách người dùng:", err);
      });
  };

  const loadConsultantsAndAppointments = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const profileRes = await fetch("http://localhost:8080/api/v1.0/profile", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const profile = await profileRes.json();
      const fullName = profile.fullName;
      console.log("👤 Tư vấn viên hiện tại:", fullName);

      const consultantsRes = await fetch("http://localhost:8080/api/v1.0/consultant/getAllConsultant", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const consultantList = await consultantsRes.json();
      console.log("📌 Danh sách tư vấn viên:", consultantList);
      setConsultants(consultantList);

      const matched = consultantList.find((c) => c.name === fullName);
      if (matched) {
        setConsultantId(matched.consultantId);
        console.log("✅ consultantId tìm được:", matched.consultantId);

        const apptRes = await fetch(`http://localhost:8080/api/v1.0/appointment/consultant/${matched.consultantId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const apptData = await apptRes.json();
        if (Array.isArray(apptData)) {
          console.log("📆 Danh sách cuộc hẹn:", apptData);
          setAppointments(apptData);
        }
        setLoading(false);
      } else {
        console.warn("⚠️ Không tìm thấy consultantId phù hợp với:", fullName);
        setLoading(false);
      }
    } catch (err) {
      console.error("❌ Lỗi khi load consultant và appointments:", err);
      setLoading(false);
    }
  };

  const getUserName = (id) => {
    const user = users.find((u) => u.userId === id);
    return user ? user.fullName : "Ẩn danh";
  };

  const getConsultantName = (id) => {
    const consultant = consultants.find((c) => c.consultantId === id);
    return consultant ? consultant.name : "Không rõ";
  };

  const handleStatusChange = (id, value) => {
    setEditStatus((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

 const handleUpdateStatus = (appt) => {
  const token = localStorage.getItem("token");
  if (!token) return alert("Vui lòng đăng nhập lại.");

  const newStatus = editStatus[appt.appointmentId] || appt.status;

  fetch(`http://localhost:8080/api/v1.0/appointment/consultant/update-status/${appt.appointmentId}?status=${newStatus}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Cập nhật thất bại");

      const contentType = res.headers.get("content-type");
      return contentType && contentType.includes("application/json")
        ? res.json()
        : res.text();
    })
    .then(() => {
      alert("✅ Cập nhật thành công!");
      loadConsultantsAndAppointments();
    })
    .catch((err) => {
      console.error("❌ Lỗi cập nhật:", err);
      alert("❌ Cập nhật thất bại.");
    });
};


  if (loading) return <div className="text-center mt-10">Đang tải dữ liệu...</div>;

  return (
    <div className="lichhen-container">
      <div className="lichhen-header">
        <h2 className="lichhen-title">📅 Danh sách tất cả cuộc hẹn</h2>
        <Link to="/" className="btn-home">🏠 Trang chủ</Link>
      </div>

      {appointments.length === 0 ? (
        <p>Không có cuộc hẹn nào.</p>
      ) : (
        <table className="lichhen-table">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Ngày</th>
              <th>Bắt đầu</th>
              <th>Kết thúc</th>
              <th>Địa điểm</th>
              <th>Trạng thái</th>
              <th>Người dùng</th>
              <th>Tư vấn viên</th>
              <th>Cập nhật</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt.appointmentId}>
                <td>{appt.appointmentId}</td>
                <td>{appt.date}</td>
                <td>{appt.startTime}</td>
                <td>{appt.endTime}</td>
                <td>{appt.location}</td>
                <td>
                  <select
                    value={editStatus[appt.appointmentId] ?? appt.status}
                    onChange={(e) => handleStatusChange(appt.appointmentId, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancel">Cancel</option>
                  </select>
                </td>
                <td>{getUserName(appt.userId)}</td>
                <td>{getConsultantName(appt.consultantId)}</td>
                <td>
                  <button className="btn-update" onClick={() => handleUpdateStatus(appt)}>
                    💾 Lưu
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
