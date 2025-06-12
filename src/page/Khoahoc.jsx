import React from "react";
import { motion } from "framer-motion";

const khoaHocData = [
  {
    title: "Thiếu nhi (6-12 tuổi)",
    image: "https://i.imgur.com/xM8cG3U.jpeg",
    description: "Học cách nói không với chất gây nghiện thông qua trò chơi và hoạt động tương tác.",
  },
  {
    title: "Thiếu niên (13-17 tuổi)",
    image: "https://i.imgur.com/OjsVNnc.jpeg",
    description: "Hiểu về tác hại của ma túy và cách đối phó với áp lực đồng trang lứa.",
  },
  {
    title: "Thanh niên (18-25 tuổi)",
    image: "https://i.imgur.com/La7fOH7.jpeg",
    description: "Phát triển kỹ năng sống, tự bảo vệ và giúp đỡ người khác tránh xa ma túy.",
  },
];

export default function KhoaHoc() {
  return (
    <section className="py-16 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          className="text-3xl font-bold text-blue-800 text-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Khóa học phòng ngừa sử dụng ma túy
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {khoaHocData.map((course, index) => (
            <motion.div
              key={index}
              className="bg-blue-50 rounded-2xl overflow-hidden shadow hover:shadow-xl hover:scale-105 transition"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-blue-700 mb-2">
                  {course.title}
                </h3>
                <p className="text-gray-700 text-sm">{course.description}</p>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                  Xem chi tiết
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
