import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./cssCom/quanly.css";

export default function QuanLy() {
  const [users, setUsers] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState({});
  const navigate = useNavigate();

  const roleOptions = ["USER", "STAFF", "MANAGER", "CONSULTANT"];
  const token = localStorage.getItem("token");

  // ✅ Tách hàm fetch users để gọi lại sau khi cập nhật
  const fetchUsers = () => {
    fetch("http://localhost:8080/api/v1.0/profileAllUser", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        const initialRoles = {};
        data.forEach((user) => {
          initialRoles[user.userId] = user.roleName;
        });
        setSelectedRoles(initialRoles);
      })
      .catch((err) => console.error("❌ Lỗi khi lấy danh sách user:", err));
  };

  // Lấy danh sách người dùng khi load lần đầu
  useEffect(() => {
    fetchUsers();
  }, [token]);

  // ✅ Gọi lại fetchUsers() sau khi cập nhật role
  const handleUpdateRole = (userId) => {
    const newRole = selectedRoles[userId];
    fetch(`http://localhost:8080/api/v1.0/${userId}/roles`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ roleName: newRole }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Cập nhật thất bại");
        alert("✅ Cập nhật role thành công");
        fetchUsers(); // 🔄 Load lại dữ liệu
      })
      .catch((err) => {
        console.error("❌ Lỗi cập nhật role:", err);
        alert("❌ Cập nhật role thất bại");
      });
  };

  return (
    <div className="quanly-container p-6">
      <button
        onClick={() => navigate("/")}
        className="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
      >
        ← Quay về trang chủ
      </button>

      <h2 className="text-2xl font-bold mb-4">Quản lý người dùng</h2>

      <table className="table-auto w-full border border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Họ tên</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Quyền hiện tại</th>
            <th className="border p-2">Cập nhật quyền</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.userId} className="text-center">
              <td className="border p-2">{user.userId}</td>
              <td className="border p-2">{user.fullName || "-"}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{user.roleName}</td>

              {user.roleName === "ADMIN" ? (
                <>
                  <td className="border p-2 text-gray-400 italic">Không khả dụng</td>
                  <td className="border p-2 text-gray-400 italic">Không khả dụng</td>
                </>
              ) : (
                <>
                  <td className="border p-2">
                    <select
                      value={selectedRoles[user.userId]}
                      onChange={(e) =>
                        setSelectedRoles({
                          ...selectedRoles,
                          [user.userId]: e.target.value,
                        })
                      }
                      className="border rounded px-2 py-1"
                    >
                      {roleOptions.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border p-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      onClick={() => handleUpdateRole(user.userId)}
                    >
                      Cập nhật
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
