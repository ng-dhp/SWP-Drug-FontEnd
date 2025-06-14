import React from "react";
import { motion } from "framer-motion";
import "./css/Khoahoc.css";
import anh_hs from "../assets/anh_hs.png";
import anh_phuhuynh from "../assets/anh_phuhuynh.png";
import anh_gv from "../assets/anh_gv.png";
import anh_tv from "../assets/anh_tv.png";
import anh_tuchoi from "../assets/anh_tuchoi.png";
import anh_gt from "../assets/anh_gt.png";
import anh_sk from "../assets/anh_sk.png";
import anh_td from "../assets/anh_td.png";
import { useNavigate } from "react-router-dom";


const khoaHocData = [
  {
    title: "Phòng ngừa Ma túy cho Học sinh",
    image: anh_hs,
    audience: "Học sinh từ 12–18 tuổi",
    level: "Cơ bản",
    quality: "1 gói",
    price: "Miễn phí",
    highlights: [
      "Hiểu biết về các loại ma túy",
      "Hậu quả của ma túy đối với cơ thể",
      "Kỹ năng từ chối và tự bảo vệ",
      "Xây dựng lối sống tích cực",
    ],
  },
  {
    title: "Hướng dẫn cho Phụ huynh",
    image: anh_phuhuynh,
    audience: "Phụ huynh, người chăm sóc",
    level: "Trung bình",
    quality: "1 gói",
    price: "500.000 VNĐ",
    highlights: [
      "Dấu hiệu nhận biết lạm dụng ma túy",
      "Giao tiếp hiệu quả với con cái",
      "Xây dựng thói quen tích cực",
    ],
  },
  {
    title: "Đào tạo cho Giáo viên",
    image: anh_gv,
    audience: "Giáo viên, nhân viên giáo dục",
    level: "Nâng cao",
    quality: "1 gói",
    price: "1.200.000 VNĐ",
    highlights: [
      "Phương pháp giáo dục phòng ngừa",
      "Hỗ trợ học sinh và thanh thiếu niên",
      "Xử lý tình huống và báo cáo",
    ],
  },
  {
    title: "Tư vấn viên Chuyên nghiệp",
    image: anh_tv,
    audience: "Chuyên gia, tư vấn viên",
    level: "Chuyên gia",
    quality: "1 gói",
    price: "3.500.000 VNĐ",
    highlights: [
      "Kỹ thuật tư vấn & hỗ trợ hồi phục",
      "Công cụ đánh giá nguy cơ (ASSIST, CRAFFT)",
      "Xây dựng chương trình can thiệp",
    ],
  },
  {
    title: "Kỹ năng Từ chối và Phòng vệ",
    image: anh_tuchoi,
    audience: "Thanh thiếu niên",
    level: "Cơ bản",
    quality: "1 gói",
    price: "300.000 VNĐ",
    highlights: [
      "Nhận biết tình huống nguy cơ",
      "Kỹ năng từ chối hiệu quả",
      "Phòng vệ cá nhân và giao tiếp an toàn",
    ],
  },
  {
    title: "Giáo dục giới tính & kỹ năng sống",
    image: anh_gt,
    audience: "Tuổi vị thành niên",
    level: "Cơ bản",
    quality: "1 gói",
    price: "400.000 VNĐ",
    highlights: [
      "Kiến thức giới tính lành mạnh",
      "Kỹ năng sống và tự quản lý bản thân",
      "Phòng tránh nguy cơ lệch lạc hành vi",
    ],
  },
  {
    title: "Chăm sóc sức khỏe tâm thần",
    image: anh_sk,
    audience: "Mọi đối tượng",
    level: "Trung bình",
    quality: "1 gói",
    price: "600.000 VNĐ",
    highlights: [
      "Nhận diện vấn đề tâm lý",
      "Chiến lược kiểm soát stress",
      "Xây dựng tinh thần tích cực",
    ],
  },
  {
    title: "Tư duy tích cực & Lối sống lành mạnh",
    image: anh_td,
    audience: "Thanh thiếu niên, người trưởng thành",
    level: "Cơ bản",
    quality: "1 gói",
    price: "Miễn phí",
    highlights: [
      "Thói quen tốt và sức khỏe tinh thần",
      "Giảm nguy cơ sa vào tệ nạn",
      "Xây dựng môi trường sống tích cực",
    ],
  },
];

export default function KhoaHoc() {
  const navigate = useNavigate();

  return (
    <section className="khoa-hoc-section">
      <button className="back-button" onClick={() => navigate("/")}>
        ← Quay về trang chủ
      </button>

      <motion.h2
        className="khoa-hoc-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        Khóa học phòng ngừa sử dụng ma túy
      </motion.h2>

      <div className="khoa-hoc-grid">
        {khoaHocData.map((course, index) => (
          <motion.div
            key={index}
            className="khoa-hoc-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <img src={course.image} alt={course.title} />
            <div className="khoa-hoc-content">
              <h3>{course.title}</h3>
              <ul className="khoa-hoc-highlights">
                {course.highlights.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              

              <div className="khoa-hoc-footer">
                <span className="khoa-hoc-price">{course.price}</span>
                <button className="khoa-hoc-button">Xem chi tiết</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
