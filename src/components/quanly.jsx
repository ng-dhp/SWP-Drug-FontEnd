import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./cssCom/quanly.css";
import { fetchAllUsers, updateUserRole } from "../api/userAPI";

export default function QuanLy() {
  const [users, setUsers] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState({});
  const navigate = useNavigate();

  const roleOptions = ["USER", "STAFF", "MANAGER", "CONSULTANT"];
  const token = localStorage.getItem("token");

  const loadUsers = async () => {
    try {
      const data = await fetchAllUsers(token);
      setUsers(data);
      const initialRoles = {};
      data.forEach((user) => {
        initialRoles[user.userId] = user.roleName;
      });
      setSelectedRoles(initialRoles);
    } catch (err) {
      console.error("❌ Lỗi khi load người dùng:", err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [token]);

  const handleUpdateRole = async (userId) => {
    const newRole = selectedRoles[userId];
    try {
      await updateUserRole(token, userId, newRole);
      alert("✅ Cập nhật role thành công");
      loadUsers();
    } catch (err) {
      alert("❌ Cập nhật role thất bại");
    }
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
