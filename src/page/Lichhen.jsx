import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./css/lichhen.css";

export default function Lichhen() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editStatus, setEditStatus] = useState({});
  const [users, setUsers] = useState([]);
  const [consultants, setConsultants] = useState([]);

  useEffect(() => {
    loadAppointments();
    loadUsers();
    loadConsultants();
  }, []);

  const loadAppointments = () => {
    const token = localStorage.getItem("token");
    if (!token) return setLoading(false);

    fetch("http://localhost:8080/api/v1.0/appointment/getAllAppointment", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAppointments(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi lấy dữ liệu cuộc hẹn:", err);
        setLoading(false);
      });
  };

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
          setUsers(data);
        }
      })
      .catch((err) => {
        console.error("Lỗi lấy danh sách người dùng:", err);
      });
  };

  const loadConsultants = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:8080/api/v1.0/consultant/getAllConsultant", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setConsultants(data);
        }
      })
      .catch((err) => {
        console.error("Lỗi lấy danh sách tư vấn viên:", err);
      });
  };

  const getUserName = (id) => {
    const user = users.find((u) => u.userId === id);
    return user ? user.fullName : id;
  };

  const getConsultantName = (id) => {
    const consultant = consultants.find((c) => c.consultantId === id);
    return consultant ? consultant.name : id;
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

    const payload = {
      date: appt.date,
      time: appt.startTime,
      status: editStatus[appt.appointmentId] || appt.status,
      location: appt.location,
      userId: appt.userId,
      consultantId: appt.consultantId,
    };

    fetch(`http://localhost:8080/api/v1.0/appointment/update/${appt.appointmentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Cập nhật thất bại");

        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return res.json();
        } else {
          return res.text();
        }
      })
      .then(() => {
        alert("✅ Cập nhật thành công!");
        loadAppointments();
      })
      .catch((err) => {
        console.error("Lỗi cập nhật:", err);
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
