import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/diemdanh.css";

export default function Diemdanh() {
  const [studentList, setStudentList] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [diemDanhStatus, setDiemDanhStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vui lòng đăng nhập.");
      return;
    }

    let fullName = "";
    let consultantId = null;

    fetch("http://localhost:8080/api/v1.0/profile", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((profileData) => {
        fullName = profileData.fullName;
        return fetch("http://localhost:8080/api/v1.0/consultant/getAllConsultant", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      })
      .then((res) => res.json())
      .then((consultants) => {
        const match = consultants.find((c) => c.name === fullName);
        if (!match) throw new Error("Không tìm thấy tư vấn viên.");
        consultantId = match.consultantId;

        return Promise.all([
          fetch(`http://localhost:8080/api/v1.0/khoahoc/danhsach-dangky/${consultantId}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch("http://localhost:8080/api/v1.0/khoahoc/all", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`http://localhost:8080/api/v1.0/khoahoc/consultant/${consultantId}/sessions`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);
      })
      .then(async ([studentsRes, coursesRes, sessionsRes]) => {
        const students = await studentsRes.json();
        const courses = await coursesRes.json();
        const sessionData = await sessionsRes.json();

        setStudentList(Array.isArray(students) ? students : []);
        setAllCourses(Array.isArray(courses) ? courses : []);
        setSessions(Array.isArray(sessionData) ? sessionData : []);

        const statusMap = {};

        for (const student of students) {
          const res = await fetch(
            `http://localhost:8080/api/v1.0/khoahoc/${student.courseId}/sessions?userId=${student.userId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const sessionList = await res.json();
          sessionList.forEach((s) => {
            statusMap[`${s.sessionId}-${student.userId}`] = s.isPresent;
          });
        }

        setDiemDanhStatus(statusMap);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Lỗi khi tải dữ liệu:", err);
        alert("Không thể tải dữ liệu điểm danh.");
        setLoading(false);
      });
  }, []);

  const getCourseById = (id) => allCourses.find((c) => c.id === id);

  const getCourseName = (courseId) => {
    const course = allCourses.find((c) => c.id === courseId);
    return course ? course.tenKhoaHoc : `Khóa ${courseId}`;
  };

  const handleDiemDanh = (sessionId, userId, isPresent) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("⚠️ Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn.");
      return;
    }

    const session = sessions.find((s) => s.sessionId === sessionId);
    const course = getCourseById(session?.courseId);

    if (!session || !course) {
      alert("Không xác định được thông tin khóa học.");
      return;
    }

    const now = new Date();
    const start = new Date(session.sessionDate);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // +2 tiếng mặc định

    if (now < start || now > end) {
      alert("⏰ Chỉ được điểm danh trong thời gian diễn ra buổi học.");
      return;
    }

    fetch("http://localhost:8080/api/v1.0/khoahoc/session/diemdanh", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ sessionId, userId, isPresent }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((text) => {
            console.error("Chi tiết lỗi từ server:", text);
            throw new Error("Điểm danh thất bại");
          });
        }
        setDiemDanhStatus((prev) => ({
          ...prev,
          [`${sessionId}-${userId}`]: isPresent,
        }));
        alert("✅ Điểm danh thành công!");
      })
      .catch((err) => {
        console.error("❌ Lỗi khi điểm danh:", err);
        alert("❌ Điểm danh thất bại.");
      });
  };

  if (loading) return <div className="text-center mt-10">Đang tải dữ liệu...</div>;

  return (
    <div className="diemdanh-container">
      <h2>📋 Danh sách buổi học & điểm danh</h2>
      <button className="btn-back-home" onClick={() => navigate("/")}>🏠 Quay về trang chủ</button>

      {sessions.length === 0 ? (
        <p>Chưa có buổi học nào.</p>
      ) : (
        <div className="session-list">
          {sessions.map((session) => {
            const studentsInCourse = studentList.filter((s) => s.courseId === session.courseId);
            const course = getCourseById(session.courseId);
            return (
              <div key={session.sessionId} className="session-block">
                <h3>📘 {getCourseName(session.courseId)} - Buổi {session.sessionIndex}</h3>
                <p>📅 Ngày: {new Date(session.sessionDate).toLocaleString()}</p>
                {course && (
                  <p>🕐 Thời gian học: {new Date(session.sessionDate).toLocaleTimeString()} - {
                    new Date(new Date(session.sessionDate).getTime() + 2 * 60 * 60 * 1000).toLocaleTimeString()
                  }</p>
                )}

                {studentsInCourse.length === 0 ? (
                  <p>Không có học viên nào đăng ký khóa này.</p>
                ) : (
                  <table className="student-table">
                    <thead>
                      <tr>
                        <th>👤 Họ tên</th>
                        <th>📧 Email</th>
                        <th>✅ Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentsInCourse.map((student) => {
                        const key = `${session.sessionId}-${student.userId}`;
                        const status = diemDanhStatus[key];
                        return (
                          <tr key={student.userId}>
                            <td>{student.fullName}</td>
                            <td>{student.email}</td>
                            <td>
                              {status === true ? (
                                <span className="status-present">✅ Có mặt</span>
                              ) : status === false ? (
                                <span className="status-absent">❌ Vắng</span>
                              ) : (
                                <>
                                  <button onClick={() => handleDiemDanh(session.sessionId, student.userId, true)}>
                                    ✅ Có mặt
                                  </button>
                                  <button
                                    onClick={() => handleDiemDanh(session.sessionId, student.userId, false)}
                                    style={{ marginLeft: "10px" }}
                                  >
                                    ❌ Vắng
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
