import React, { useEffect, useState } from "react";
import "./cssCom/XuLyYeuCau.css";
import {
  getUserSurveyRequests,
  approveSurveyRequest,
  rejectSurveyRequest,
} from "../api/ServiceAPI";

export default function XuLyYeuCau() {
  const [requests, setRequests] = useState([]);
  const [rejectionReasons, setRejectionReasons] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    getUserSurveyRequests(token)
      .then(setRequests)
      .catch((err) => console.error("❌ Lỗi khi lấy yêu cầu:", err));
  }, [token]);

  const handleApprove = async (id) => {
    try {
      await approveSurveyRequest(id, token);
      alert("✅ Đã chấp nhận yêu cầu");
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "APPROVED" } : r))
      );
    } catch (err) {
      alert("❌ Lỗi chấp nhận: " + err.message);
    }
  };

  const handleReject = async (id) => {
    const reason = rejectionReasons[id];
    if (!reason) {
      alert("Vui lòng nhập lý do từ chối");
      return;
    }

    try {
      await rejectSurveyRequest(id, reason, token);
      alert("✅ Đã từ chối yêu cầu");
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "REJECTED" } : r))
      );
    } catch (err) {
      alert("❌ Lỗi từ chối: " + err.message);
    }
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
              <td className={`status ${req.status.toLowerCase()}`}>
                {req.status === "PENDING" ? "Chờ xử lý" : "Đã xử lý"}
              </td>
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
