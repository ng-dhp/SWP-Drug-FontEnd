import React, { useEffect, useState } from "react";
import "./cssCom/quanly.css"; // Thêm file CSS cho QuanLy
export default function QuanLy() {
  const [users, setUsers] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState({}); // { userId: selectedRole }

  const roleOptions = ["USER", "STAFF", "MANAGER"];

  const token = localStorage.getItem("token");

  // Lấy danh sách toàn bộ người dùng
  useEffect(() => {
    fetch("http://localhost:8080/api/v1.0/profileAllUser", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        // Khởi tạo role hiện tại vào selectedRoles
        const initialRoles = {};
        data.forEach((user) => {
          initialRoles[user.id] = user.roleName;
        });
        setSelectedRoles(initialRoles);
      })
      .catch((err) => console.error("❌ Lỗi khi lấy danh sách user:", err));
  }, [token]);

  // Gọi API cập nhật role
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
      })
      .catch((err) => {
        console.error("❌ Lỗi cập nhật role:", err);
        alert("❌ Cập nhật role thất bại");
      });
  };

  return (
    <div className="quanly-container p-6">
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
            <tr key={user.id} className="text-center">
              <td className="border p-2">{user.id}</td>
              <td className="border p-2">{user.fullName || "-"}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{user.roleName}</td>
              <td className="border p-2">
                <select
                  value={selectedRoles[user.id]}
                  onChange={(e) =>
                    setSelectedRoles({
                      ...selectedRoles,
                      [user.id]: e.target.value,
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
                  onClick={() => handleUpdateRole(user.id)}
                >
                  Cập nhật
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
