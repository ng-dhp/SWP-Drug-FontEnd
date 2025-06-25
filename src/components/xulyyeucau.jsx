import React, { useEffect, useState } from "react";
import "./cssCom/XuLyYeuCau.css"; // 👉 Nhớ tạo file này

export default function XuLyYeuCau() {
  const [requests, setRequests] = useState([]);
  const [rejectionReasons, setRejectionReasons] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:8080/api/v1.0/staff/survey/get-user-requests", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setRequests(data))
      .catch((err) => console.error("❌ Lỗi khi lấy yêu cầu:", err));
  }, [token]);

  const handleApprove = (id) => {
    fetch(`http://localhost:8080/api/v1.0/staff/survey/request/${id}/approve`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Chấp nhận thất bại");
        alert("✅ Đã chấp nhận yêu cầu");
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: "APPROVED" } : r))
        );
      })
      .catch((err) => alert("❌ Lỗi chấp nhận:", err.message));
  };

  const handleReject = (id) => {
    const reason = rejectionReasons[id];
    if (!reason) {
      alert("Vui lòng nhập lý do từ chối");
      return;
    }

    fetch(
      `http://localhost:8080/api/v1.0/staff/survey/request/${id}/reject?rejectionReason=${encodeURIComponent(reason)}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Từ chối thất bại");
        alert("✅ Đã từ chối yêu cầu");
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: "REJECTED" } : r))
        );
      })
      .catch((err) => alert("❌ Lỗi từ chối:", err.message));
  };

  return (
    <div className="xulyyeucau-container">
      <h2 className="xulyyeucau-title">Xử lý yêu cầu khảo sát</h2>
      <table className="xulyyeucau-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Người dùng</th>
            <th>Lý do</th>
            <th>Ngày yêu cầu</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id}>
              <td>{req.id}</td>
              <td>{req.userId}</td>
              <td>{req.reason}</td>
              <td>{new Date(req.requestDate).toLocaleString()}</td>
              <td className={`status ${req.status.toLowerCase()}`}>{req.status}</td>
              <td>
                {req.status === "PENDING" ? (
                  <div className="action-buttons">
                    <button
                      className="btn btn-approve"
                      onClick={() => handleApprove(req.id)}
                    >
                      ✔ Chấp nhận
                    </button>
                    <input
                      type="text"
                      placeholder="Lý do từ chối"
                      value={rejectionReasons[req.id] || ""}
                      onChange={(e) =>
                        setRejectionReasons({
                          ...rejectionReasons,
                          [req.id]: e.target.value,
                        })
                      }
                      className="rejection-input"
                    />
                    <button
                      className="btn btn-reject"
                      onClick={() => handleReject(req.id)}
                    >
                      ✖ Từ chối
                    </button>
                  </div>
                ) : (
                  <span className="status-processed">Đã xử lý</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
