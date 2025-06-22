import React, { useEffect, useState } from "react";
import "./cssCom/profile.css";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("http://localhost:8080/api/v1.0/profile", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Lỗi khi lấy profile");
        return res.json();
      })
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-10">Đang tải...</div>;
  if (!profile) return <div className="text-center mt-10 text-red-500">Không có dữ liệu</div>;

  return (
    <div className="profile-container">
      <h2 className="tittle-thongtin">Thông tin cá nhân</h2>
      <ul className="thongtin">
        <li><strong>👤 Họ tên:</strong> {profile.fullName}</li>
        <li><strong>📧 Email:</strong> {profile.email}</li>
        <li><strong>🎂 Năm sinh:</strong> {profile.yob}</li>
        <li><strong>⚥ Giới tính:</strong> {profile.gender === "Male" ? "Nam" : "Nữ"}</li>
        <li><strong>📱 Số điện thoại:</strong> {profile.phone}</li>
        <li><strong>🛡️ Vai trò:</strong> {profile.roleName}</li>
        <li><strong>🔑 Đăng nhập bằng:</strong> {profile.authenticationProvider}</li>
      </ul>
    </div>
  );
}
