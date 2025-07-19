import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateCourse from "./CreateCourse";
import "./css/Quanlykhoahoc.css"; // ✅ CSS riêng cho trang này

export default function Quanlykhoahoc() {
    const [courses, setCourses] = useState([]);
    const [showCreateCourse, setShowCreateCourse] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        fetch("http://localhost:8080/api/v1.0/khoahoc/all", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Không thể tải khóa học.");
                return res.json();
            })
            .then((data) => Array.isArray(data) && setCourses(data))
            .catch((err) => console.error("Lỗi:", err.message));
    }, [token, navigate]);

    const handleToggleActive = async (courseId, currentActive) => {
        try {
            const res = await fetch("http://localhost:8080/api/v1.0/khoahoc/update-active", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ courseId, active: !currentActive }),
            });

            const result = await res.text(); // Đọc phản hồi dạng text

            if (!res.ok) throw new Error(result || "Lỗi cập nhật");

            console.log("Phản hồi cập nhật:", result);

            setCourses((prev) =>
                prev.map((course) =>
                    course.id === courseId ? { ...course, active: !currentActive } : course
                )
            );
        } catch (err) {
            console.error("Lỗi cập nhật trạng thái:", err.message);
        }
    };


    const handleCourseCreated = () => {
        setShowCreateCourse(false);
        fetch("http://localhost:8080/api/v1.0/khoahoc/all", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => Array.isArray(data) && setCourses(data))
            .catch((err) => console.error("Lỗi reload:", err.message));
    };

    return (
        <div className="page-container">
            <h2 className="page-title">Quản lý Khóa học</h2>

            <div className="button-container">
                <button
                    className="btn-primary"
                    onClick={() => setShowCreateCourse(!showCreateCourse)}
                >
                    {showCreateCourse ? "Đóng form tạo khóa học" : "➕ Tạo khóa học mới"}
                </button>
            </div>

            {showCreateCourse && (
                <div className="form-container">
                    <CreateCourse onClose={() => setShowCreateCourse(false)} onCourseCreated={handleCourseCreated} />
                </div>
            )}

            <div className="table-container">
                <table className="course-table">
                    <thead>
                        <tr>
                            <th>Tên khóa học</th>
                            <th>Tư vấn viên</th>
                            <th>Địa điểm</th>
                            <th>Giá</th>
                            <th>Bắt đầu</th>
                            <th>Kết thúc</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course) => (
                            <tr key={course.id}>
                                <td>{course.courseName}</td>
                                <td>{course.consultant?.name || "Không có"}</td>
                                <td>{course.location}</td>
                                <td>{course.price.toLocaleString()}đ</td>
                                <td>{new Date(course.startTime).toLocaleString()}</td>
                                <td>{new Date(course.endTime).toLocaleString()}</td>
                                <td className={course.active ? "text-green" : "text-red"}>
                                    {course.active ? "Hoạt động" : "Ngưng"}
                                </td>
                                <td>
                                    <button
                                        className={course.active ? "btn-danger" : "btn-success"}
                                        onClick={() => handleToggleActive(course.id, course.active)}
                                    >
                                        {course.active ? "Ngưng hoạt động" : "Kích hoạt"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
