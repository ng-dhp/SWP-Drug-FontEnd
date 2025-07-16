import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./css/Khoahoc.css";
import defaultImage from "../assets/anh_hs.png";
import Navbar from "../components/navbar";
import LoginModal from "../components/Login";
import Register from "../components/Register";
import CreateCourse from "./CreateCourse";

export default function KhoaHoc() {
  const navigate = useNavigate();
  const [khoaHocData, setKhoaHocData] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(""); // ✅ Lưu role để phân quyền
  const [thongBao, setThongBao] = useState("");
  const [thongBaoType, setThongBaoType] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showCreateCourse, setShowCreateCourse] = useState(false); // ✅ Toggle tạo khóa học
  const token = localStorage.getItem("token");
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);

  // ✅ Lấy thông tin người dùng
  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:8080/api/v1.0/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUserId(data.userId);
        setUserRole(data.roleName); // 👈 Lưu roleName (ADMIN)
      })
      .catch((err) => console.error("Lỗi lấy profile:", err));
  }, [token]);

  // ✅ Lấy danh sách khóa học
  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:8080/api/v1.0/khoahoc/getallcourse", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setKhoaHocData(data))
      .catch((err) => console.error("Lỗi getAllCourse:", err));
  }, [token]);

  // ✅ Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  // ✅ Đăng nhập thành công
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
    window.location.reload();
  };

  const handleDangKy = (courseId, giaTien) => {
    if (!userId) {
      setThongBao("❌ Không xác định được người dùng.");
      setThongBaoType("error");
      return;
    }

    // Bước 1: Đăng ký khóa học
    fetch(`http://localhost:8080/api/v1.0/khoahoc/dangky/${courseId}?userId=${userId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) return res.text().then((msg) => Promise.reject(msg));
        return res.text();
      })
      .then((message) => {
        setThongBao(`✅ ${message}`);
        setThongBaoType("success");

        // Bước 2: Gọi API thanh toán
        return fetch(`http://localhost:8080/api/v1.0/payments/course/${courseId}/user/${userId}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then((res) => {
        if (!res.ok) throw new Error("❌ Giao dịch thanh toán không thành công.");

        // 👉 Điều hướng qua trang PaymentProcess, truyền dữ liệu nếu cần
        navigate("/payment-process", {
          state: {
            courseId,
            userId,
            amount: giaTien,
          },
        });
      })
      .catch((errMsg) => {
        setThongBao(`❌ ${errMsg.message || errMsg}`);
        setThongBaoType("error");
      });
  };



  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        onLogin={() => setShowLoginModal(true)}
        onRegister={() => setShowRegisterModal(true)}
        onLogout={handleLogout}
      />

      {/* ✅ Nút tạo khóa học (chỉ admin) */}
      {userRole === "ADMIN" && (
        <>
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <button
              className="khoa-hoc-button"
              onClick={() => setShowCreateCourse(!showCreateCourse)}
            >
              {showCreateCourse ? "Đóng form tạo khóa học" : "➕ Tạo khóa học mới"}
            </button>
          </div>

          {showCreateCourse && (
            <CreateCourse
              onClose={() => setShowCreateCourse(false)}
              onCourseCreated={() => {
                setShowCreateCourse(false);
                window.location.reload();
              }}
            />
          )}

        </>
      )}

      <section className="khoa-hoc-section">
        <motion.h2
          className="khoa-hoc-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Khóa học phòng ngừa sử dụng ma túy
        </motion.h2>

        {thongBao && (
          <div className={`alert ${thongBaoType === "success" ? "alert-success" : "alert-error"}`}>
            {thongBao}
          </div>
        )}

        {/* ✅ Hiển thị danh sách khóa học */}
        {khoaHocData.length === 1 ? (
          <div className="khoa-hoc-single">
            <motion.div
              key={khoaHocData[0].id}
              className="khoa-hoc-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: true }}
            >
              <img src={defaultImage} alt={khoaHocData[0].tenKhoaHoc} />
              <div className="khoa-hoc-content">
                <h3>{khoaHocData[0].tenKhoaHoc}</h3>
                <ul className="khoa-hoc-highlights">
                  <li>👥 Tư vấn viên: {khoaHocData[0].consultant?.name || "Chưa rõ"}</li>
                  <li>📍 Địa điểm: {khoaHocData[0].diaDiem}</li>
                  <li>
                    🕒 Thời gian:{" "}
                    {new Date(khoaHocData[0].thoiGianBatDau).toLocaleString("vi-VN")} →{" "}
                    {new Date(khoaHocData[0].thoiGianKetThuc).toLocaleString("vi-VN")}
                  </li>
                  <li>👤 Số lượng tối đa: {khoaHocData[0].soLuongToiDa}</li>
                </ul>
                <div className="khoa-hoc-footer">
                  <span className="khoa-hoc-price">
                    {khoaHocData[0].giaTien === 0 || !khoaHocData[0].giaTien
                      ? "Miễn phí"
                      : `${khoaHocData[0].giaTien.toLocaleString()} VNĐ`}
                  </span>
                  <button
                    className="khoa-hoc-button"
                    onClick={() => handleDangKy(khoaHocData[0].id, khoaHocData[0].giaTien)}
                  >
                    Đăng ký khóa học
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="khoa-hoc-grid">
            {khoaHocData.map((course, index) => (
              <motion.div
                key={course.id}
                className="khoa-hoc-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <img src={defaultImage} alt={course.tenKhoaHoc} />
                <div className="khoa-hoc-content">
                  <h3>{course.tenKhoaHoc}</h3>
                  <ul className="khoa-hoc-highlights">
                    <li>👥 Tư vấn viên: {course.consultant?.name || "Chưa rõ"}</li>
                    <li>📍 Địa điểm: {course.diaDiem}</li>
                    <li>
                      🕒 Thời gian:{" "}
                      {new Date(course.thoiGianBatDau).toLocaleString("vi-VN")} →{" "}
                      {new Date(course.thoiGianKetThuc).toLocaleString("vi-VN")}
                    </li>
                    <li>👤 Số lượng tối đa: {course.soLuongToiDa}</li>
                  </ul>
                  <div className="khoa-hoc-footer">
                    <span className="khoa-hoc-price">
                      {course.giaTien === 0 || !course.giaTien
                        ? "Miễn phí"
                        : `${course.giaTien.toLocaleString()} VNĐ`}
                    </span>
                    <button
                      className="khoa-hoc-button"
                      onClick={() => handleDangKy(course.id, course.giaTien)}
                    >
                      Đăng ký khóa học
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Modal đăng nhập/đăng ký */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      {showRegisterModal && <Register onClose={() => setShowRegisterModal(false)} />}
    </>
  );
}
