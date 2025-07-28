import React, { useEffect, useState } from "react";
import "./css/DashBoardYeuCau.css";
import API_ENDPOINTS from "../APIconfig";

export default function DashboardYeuCau() {
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(API_ENDPOINTS.DASHBOARD_RESOLVED_REQUESTS, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setRequests(data))
      .catch((err) =>
        console.error("❌ Lỗi khi lấy danh sách yêu cầu đã xử lý:", err)
      );
  }, [token]);

  return (
    <div className="dashboard-yeucau-container">
      <h2 className="dashboard-title">Yêu cầu đã được xử lý</h2>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Người dùng</th>
            <th>Template</th>
            <th>Lý do</th>
            <th>Ngày yêu cầu</th>
            <th>Trạng thái</th>
            <th>Lý do từ chối</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id}>
              <td>{req.id}</td>
              <td>{req.userId}</td>
              <td>{req.templateId}</td>
              <td>{req.reason}</td>
              <td>{new Date(req.requestDate).toLocaleString()}</td>
              <td className={`status ${req.status.toLowerCase()}`}>
                {req.status === "APPROVED"
                  ? "Đã Xử Xý"
                  : req.status === "REJECTED"
                    ? "Đã Từ Chối"
                    : req.status}
              </td>

              <td>{req.rejectionReason || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
