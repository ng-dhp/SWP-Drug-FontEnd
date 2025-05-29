import React from "react";
import { motion } from "framer-motion";
import { FaHeartbeat, FaUserMd, FaSchool, FaUsers } from "react-icons/fa";
import './App.css';


export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-800 font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur bg-blue-700/90 text-white shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <h1 className="tittle">STOP ADDICTION</h1>
          <nav className="space-x-4 text-sm md:text-base">
            <a href="#" className="hover:underline hover:text-gray-200">Trang chủ</a>
            <a href="#" className="hover:underline hover:text-gray-200">Đánh giá</a>
            <a href="#" className="hover:underline hover:text-gray-200">Tư vấn</a>
            <a href="#" className="hover:underline hover:text-gray-200">Khóa học</a>
            <a href="#" className="hover:underline hover:text-gray-200">Chiến dịch</a>
            <a href="#" className="hover:underline hover:text-gray-200">Dashboard</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-6 bg-gradient-to-r from-blue-100 via-white to-blue-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <motion.div
            className="md:w-1/2 space-y-6"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="h2-chungtay">
              Chung tay vì một cộng đồng không chất gây nghiện
            </h2>
            <p className="p-nentang">
              Nền tảng hỗ trợ đánh giá, tư vấn và giáo dục nhằm ngăn ngừa sử dụng chất gây nghiện, đặc biệt ở giới trẻ.
            </p>
            <button className="batdau">
              Bắt đầu đánh giá nguy cơ
            </button>
          </motion.div>
          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="https://img.freepik.com/free-vector/addiction-abstract-concept-illustration_335657-3627.jpg"
              alt="Prevention illustration"
              className="w-full rounded-xl shadow-xl"
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h3
className="text-3xl font-bold text-center text-blue-800 mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Tính năng nổi bật
          </motion.h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: <FaHeartbeat size={32} />, title: "Đánh giá nguy cơ", desc: "Sử dụng ASSIST, CRAFFT để phát hiện sớm." },
              { icon: <FaUserMd size={32} />, title: "Tư vấn chuyên gia", desc: "Kết nối với bác sĩ và chuyên gia tâm lý." },
              { icon: <FaSchool size={32} />, title: "Khóa học phòng ngừa", desc: "Học theo độ tuổi, nội dung sinh động dễ tiếp thu." },
              { icon: <FaUsers size={32} />, title: "Chương trình cộng đồng", desc: "Lan tỏa nhận thức qua chiến dịch, truyền thông." },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="bg-blue-50 rounded-2xl p-6 shadow hover:shadow-xl hover:scale-105 transition text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-blue-600 mb-3">{item.icon}</div>
                <h4 className="text-xl font-semibold text-blue-700 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-700 text-white py-6 mt-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; 2025 Tổ chức Phòng chống Sử dụng Chất Gây Nghiện</p>
          <div className="space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:underline">Facebook</a>
            <a href="#" className="hover:underline">YouTube</a>
            <a href="#" className="hover:underline">Liên hệ</a>
          </div>
        </div>
      </footer>
    </div>
  );
}