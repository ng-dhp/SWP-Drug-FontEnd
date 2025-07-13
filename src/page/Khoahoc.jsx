import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./css/Khoahoc.css";
import defaultImage from "../assets/anh_hs.png";

export default function KhoaHoc() {
  const navigate = useNavigate();
  const [khoaHocData, setKhoaHocData] = useState([]);
  const [userId, setUserId] = useState(null); // lưu userId từ API
  const [thongBao, setThongBao] = useState("");

  const token = localStorage.getItem("token");

  // Gọi profile để lấy userId
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
      .then((data) => {
        setUserId(data.userId); // 👈 đặt userId từ response
      })
      .catch((error) => {
        console.error("Lỗi gọi API profile:", error);
      });
  }, [token]);

  // Gọi getAllCourse sau khi đã có token
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
      .then((data) => {
        setKhoaHocData(data);
      })
      .catch((error) => {
        console.error("Lỗi gọi API getAllCourse:", error);
      });
  }, [token]);

  // Đăng ký khóa học
  const handleDangKy = (courseId) => {
    if (!userId) {
      setThongBao("❌ Không xác định được người dùng.");
      return;
    }

    fetch(
      `http://localhost:8080/api/v1.0/khoahoc/dangky/${courseId}?userId=${userId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => {
        if (!res.ok) return res.text().then((msg) => Promise.reject(msg));
        return res.text();
      })
      .then((message) => {
        setThongBao(`✅ ${message}`);
      })
      .catch((errMsg) => {
        setThongBao(`❌ ${errMsg}`);
      });
  };


  return (
    <section className="khoa-hoc-section">
      <button className="back-button" onClick={() => navigate("/")}>
        🏠 Trở về màn hình chính
      </button>

      <motion.h2
        className="khoa-hoc-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        Khóa học phòng ngừa sử dụng ma túy
      </motion.h2>

      {thongBao && <div className="alert">{thongBao}</div>}

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
    </section>
  );
}
