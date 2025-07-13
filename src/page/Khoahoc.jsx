import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./css/Khoahoc.css";
import defaultImage from "../assets/anh_hs.png";

export default function KhoaHoc() {
  const navigate = useNavigate();
  const [khoaHocData, setKhoaHocData] = useState([]);
  const [userId, setUserId] = useState(null);
  const [thongBao, setThongBao] = useState("");
  const [thongBaoType, setThongBaoType] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:8080/api/v1.0/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Không lấy được profile");
        return res.json();
      })
      .then((data) => setUserId(data.userId))
      .catch((error) => console.error("Lỗi gọi API profile:", error));
  }, [token]);

  useEffect(() => {
    fetch("http://localhost:8080/api/v1.0/khoahoc/getallcourse", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Lỗi khi tải khóa học");
        return res.json();
      })
      .then((data) => setKhoaHocData(data))
      .catch((error) => console.error("Lỗi gọi API getAllCourse:", error));
  }, [token]);

  const handleDangKy = (courseId) => {
    if (!userId) {
      setThongBao("❌ Không xác định được người dùng.");
      setThongBaoType("error");
      return;
    }

    fetch(`http://localhost:8080/api/v1.0/khoahoc/dangky?courseId=${courseId}&userId=${userId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) return res.text().then((msg) => Promise.reject(msg));
        return res.text();
      })
      .then((message) => {
        setThongBao(`✅ ${message}`);
        setThongBaoType("success");
      })
      .catch((errMsg) => {
        setThongBao(`❌ ${errMsg}`);
        setThongBaoType("error");
      });
  };

  return (
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
                  onClick={() => handleDangKy(khoaHocData[0].id)}
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
                    onClick={() => handleDangKy(course.id)}
                  >
                    Đăng ký khóa học
                  </button>
</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ✅ Nút back nằm giữa cuối trang */}
      <div className="back-button-wrapper">
        <button className="back-button" onClick={() => navigate("/")}>
          🏠 Trở về màn hình chính
        </button>
      </div>
    </section>
  );
}