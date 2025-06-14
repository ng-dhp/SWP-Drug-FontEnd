import React from "react";
import { motion } from "framer-motion";
import "./css/Khoahoc.css";

const khoaHocData = [
  {
    id: 1,
    title: "Hiểu biết về ma túy và tác hại",
    description: "Khóa học cung cấp kiến thức cơ bản về các loại ma túy và hậu quả của việc sử dụng.",
    image: "https://source.unsplash.com/400x200/?drugs,education",
  },
  {
    id: 2,
    title: "Kỹ năng từ chối và bảo vệ bản thân",
    description: "Giúp bạn học cách từ chối trong các tình huống rủ rê, cám dỗ và bảo vệ chính mình.",
    image: "https://source.unsplash.com/400x200/?selfdefense,training",
  },
  {
    id: 3,
    title: "Chăm sóc sức khỏe tâm thần",
    description: "Hướng dẫn cách nhận biết và cải thiện sức khỏe tinh thần để phòng ngừa sử dụng chất.",
    image: "https://source.unsplash.com/400x200/?mentalhealth,wellbeing",
  },
  {
    id: 4,
    title: "Tư duy tích cực và xây dựng lối sống lành mạnh",
    description: "Rèn luyện tư duy tích cực, lối sống khoa học, tránh xa các hành vi có hại.",
    image: "https://source.unsplash.com/400x200/?positive,lifestyle",
  },
  {
    id: 5,
    title: "Kỹ năng giao tiếp và kết nối xã hội",
    description: "Giúp bạn phát triển kỹ năng giao tiếp hiệu quả và tạo dựng mối quan hệ tích cực.",
    image: "https://source.unsplash.com/400x200/?communication,teamwork",
  },
  {
    id: 6,
    title: "Giáo dục giới tính và kỹ năng sống",
    description: "Hướng đến sự hiểu biết về giới tính và các kỹ năng sống cần thiết trong độ tuổi vị thành niên.",
    image: "https://source.unsplash.com/400x200/?sexualeducation,life-skills",
  }
];


export default function KhoaHoc() {
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
              <p>{course.description}</p>
              <button>Xem chi tiết</button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
