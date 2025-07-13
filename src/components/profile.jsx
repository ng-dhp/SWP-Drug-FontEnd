import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./cssCom/profile.css";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [surveyHistory, setSurveyHistory] = useState([]);
  const [requestHistory, setRequestHistory] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [showCourses, setShowCourses] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState({ name: "", specialization: "", yob: "", phone: "", gender: "" });
  const [courseSessions, setCourseSessions] = useState({});
  const [consultantSessions, setConsultantSessions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return setLoading(false);

    fetch("http://localhost:8080/api/v1.0/profile", {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setEditData({
          name: data.fullName || "",
          specialization: data.specialization || "",
          yob: data.yob || "",
          phone: data.phone || "",
          gender: data.gender || ""
        });

        const userId = data.userId;
        return Promise.all([
          fetch("http://localhost:8080/api/v1.0/survey-template/my", { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }),
          fetch("http://localhost:8080/api/v1.0/my-requests/view-request-retake-survey", { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }),
          fetch("http://localhost:8080/api/v1.0/appointment/myAppointment", { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }),
          fetch(`http://localhost:8080/api/v1.0/feedback/user/${userId}`, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }),
          fetch("http://localhost:8080/api/v1.0/consultant/getAllConsultant", { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } })
        ]);
      })
      .then(async ([surveyRes, requestRes, apptRes, fbRes, consultantRes]) => {
        const [survey, requests, appts, fb, consultants] = await Promise.all([
          surveyRes.ok ? surveyRes.json() : [],
          requestRes.ok ? requestRes.json() : [],
          apptRes.ok ? apptRes.json() : [],
          fbRes.ok ? fbRes.json() : [],
          consultantRes.ok ? consultantRes.json() : []
        ]);
        setSurveyHistory(Array.isArray(survey) ? survey : []);
        setRequestHistory(Array.isArray(requests) ? requests : []);
        setAppointments(Array.isArray(appts) ? appts : appts ? [appts] : []);
        setFeedbacks(Array.isArray(fb) ? fb : []);
        setConsultants(Array.isArray(consultants) ? consultants : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi khi tải dữ liệu:", err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Vui lòng đăng nhập lại.");
    const payload = profile.roleName === "CONSULTANT"
      ? { name: editData.name, specialization: editData.specialization, yob: parseInt(editData.yob), phone: editData.phone }
      : { fullName: editData.name, yob: parseInt(editData.yob), gender: editData.gender, phone: editData.phone };

    fetch("http://localhost:8080/api/v1.0/update-my-profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error("Cập nhật thất bại");
        return res.json();
      })
      .then(() => {
        alert("✅ Cập nhật thành công!");
        setProfile(prev => ({
          ...prev,
          fullName: editData.name,
          specialization: editData.specialization || prev.specialization,
          yob: editData.yob,
          gender: editData.gender || prev.gender,
          phone: editData.phone
        }));
      })
      .catch(err => {
        console.error("Lỗi cập nhật:", err);
        alert("❌ Cập nhật thất bại.");
      });
  };

  const handleFetchMyCourses = () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Vui lòng đăng nhập.");

    fetch("http://localhost:8080/api/v1.0/profile", {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((userData) => {
        const userName = userData.fullName;

        if (userData.roleName === "CONSULTANT") {
          return fetch("http://localhost:8080/api/v1.0/consultant/getAllConsultant", {
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          })
            .then((res) => res.json())
            .then((consultants) => {
              const matched = consultants.find((c) => c.name === userName);
              if (!matched) throw new Error("Không tìm thấy tư vấn viên phù hợp.");

              // Gọi đồng thời 2 API
              return Promise.all([
                fetch(`http://localhost:8080/api/v1.0/khoahoc/consultant/${matched.consultantId}/sessions`, {
                  headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                }),
                fetch("http://localhost:8080/api/v1.0/khoahoc/getallcourse", {
                  headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                })
              ]);
            })
            .then(async ([sessionsRes, allCoursesRes]) => {
              const sessionsData = await sessionsRes.json();
              const allCoursesData = await allCoursesRes.json();

              setConsultantSessions(Array.isArray(sessionsData) ? sessionsData : []);
              setAllCourses(Array.isArray(allCoursesData) ? allCoursesData : []);

              // 🧪 Thêm dòng này để kiểm tra dữ liệu:
              console.log("✅ Danh sách tất cả khóa học (allCourses):", allCoursesData);

              setShowCourses(true);
            });

        } else {
          return fetch(`http://localhost:8080/api/v1.0/khoahoc/khoahoc-cuatoi/${userData.userId}`, {
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          })
            .then(res => res.json())
            .then((data) => {
              setMyCourses(Array.isArray(data) ? data : []);
              setShowCourses(true);
            });
        }
      })
      .catch(err => {
        console.error("❌ Lỗi khi lấy dữ liệu khóa học/lịch dạy:", err);
        alert("Không thể tải dữ liệu khóa học hoặc lịch dạy.");
      });
  };


  const getCourseInfoById = (courseId) => {
    const course = allCourses.find(c => Number(c.id) === Number(courseId));
    return course ? { tenKhoaHoc: course.tenKhoaHoc } : { tenKhoaHoc: `Khóa ${courseId}` };
  };





  const getConsultantName = (id) => {
    const c = consultants.find((c) => c.consultantId === id);
    return c ? c.name : `ID ${id}`;
  };

  const fetchSessionsForCourse = (courseId) => {
    const token = localStorage.getItem("token");
    if (!token || !profile?.userId) return;

    fetch(`http://localhost:8080/api/v1.0/khoahoc/${courseId}/sessions?userId=${profile.userId}`, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setCourseSessions(prev => ({
          ...prev,
          [courseId]: Array.isArray(data) ? data : []
        }));
      })
      .catch(err => console.error("Lỗi khi lấy buổi học:", err));
  };

  const [allCourses, setAllCourses] = useState([]);



  if (loading) return <div className="text-center mt-10">Đang tải...</div>;
  if (!profile) return <div className="text-center mt-10 text-red-500">Không có dữ liệu</div>;

  return (
    <div className="profile-container">
      <h2 className="tittle-thongtin">Thông tin cá nhân</h2>
      <ul className="thongtin">
        <li><strong>👤 Họ tên:</strong> {profile.fullName}</li>
        <li><strong>📧 Email:</strong> {profile.email}</li>
        <li><strong>🎂 Năm sinh:</strong> {profile.yob}</li>
        <li><strong>⚥ Giới tính:</strong> {profile.gender === "Male" ? "Nam" : profile.gender === "Female" ? "Nữ" : "Chưa cập nhật"}</li>
        <li><strong>📱 Số điện thoại:</strong> {profile.phone}</li>
        <li><strong>🛡️ Vai trò:</strong> {profile.roleName}</li>
      </ul>

      {(profile.roleName === "CONSULTANT" || profile.roleName === "USER") && (
        <div className={profile.roleName === "CONSULTANT" ? "consultant-edit" : "user-edit"}>
          <h3>🛠️ Cập nhật thông tin {profile.roleName === "CONSULTANT" ? "tư vấn viên" : "cá nhân"}</h3>
          <label>Họ tên:<input type="text" name="name" value={editData.name} onChange={handleChange} /></label>
          {profile.roleName === "CONSULTANT" && (
            <label>Chuyên ngành:<input type="text" name="specialization" value={editData.specialization} onChange={handleChange} /></label>
          )}
          <label>Năm sinh:<input type="number" name="yob" value={editData.yob} onChange={handleChange} /></label>
          {profile.roleName === "USER" && (
            <label>Giới tính:
              <select name="gender" value={editData.gender || ""} onChange={handleChange}>
                <option value="">-- Chọn giới tính --</option>
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
              </select>
            </label>
          )}
          <label>Số điện thoại:<input type="text" name="phone" value={editData.phone} onChange={handleChange} /></label>
          <button className="btn-update" onClick={handleUpdate}>💾 Lưu thông tin</button>
        </div>
      )}

      <button className="btn-back-home" onClick={() => navigate("/")}>🏠 Quay về trang chủ</button>
      <div className="flex-btn-group">
        <button className="btn-update" onClick={handleFetchMyCourses}>
          🎓 {profile.roleName === "CONSULTANT" ? "Lịch dạy của tôi" : "Khóa học của tôi"}
        </button>

        {profile.roleName === "CONSULTANT" && (
          <button className="btn-update" onClick={() => navigate("/diemdanh")}>
            📋 Điểm danh
          </button>
        )}
      </div>



      <div className="history-columns">
        <div className="survey-history">
          <h2 className="tittle-thongtin">📝 Lịch sử khảo sát</h2>
          {surveyHistory.length === 0 ? <p>Không có bài khảo sát nào được thực hiện.</p> : surveyHistory.map((survey) => (
            <div key={survey.surveyId} className="survey-item">
              <h3>{survey.surveyType} - {survey.status}</h3>
              <p><strong>📅 Ngày làm:</strong> {survey.takenDate}</p>
              <p><strong>🧮 Tổng điểm:</strong> {survey.totalScore}</p>
              <p><strong>🩺 Đánh giá:</strong> {survey.recommendation || "Chưa có"}</p>
              <details>
                <summary>📋 Xem chi tiết câu trả lời</summary>
                <ul>
                  {(survey.answers || []).map((ans) => (
                    <li key={ans.questionId}><strong>Câu {ans.questionId}:</strong> {ans.questionText}<br /><em>Trả lời:</em> {ans.answerText || "Chưa trả lời"} | <em>Điểm:</em> {ans.score}</li>
                  ))}
                </ul>
              </details>
            </div>
          ))}
        </div>

        <div className="request-history">
          <h2 className="tittle-thongtin">📨 Lịch sử yêu cầu làm lại khảo sát</h2>
          {requestHistory.length === 0 ? <p>Không có yêu cầu nào.</p> : requestHistory.map((req) => (
            <div key={req.id} className="request-item">
              <p><strong>📄 Mã yêu cầu:</strong> {req.id}</p>
              <p><strong>📘 Tên khảo sát:</strong> {req.name}</p>
              <p><strong>🗓 Ngày yêu cầu:</strong> {new Date(req.requestDate).toLocaleString()}</p>
              <p><strong>🧾 Lý do:</strong> {req.reason}</p>
              <p><strong>📌 Trạng thái:</strong> {req.status}</p>
              {req.status === "REJECTED" && (<p><strong>❌ Lý do từ chối:</strong> {req.rejectionReason || "Không có"}</p>)}
            </div>
          ))}
        </div>

        <div className="appointment-history">
          <h2 className="tittle-thongtin">📅 Lịch sử cuộc hẹn tư vấn</h2>
          {appointments.length === 0 ? <p>Không có cuộc hẹn nào.</p> : appointments.map((appointment) => (
            <div key={appointment.appointmentId} className="appointment-item">
              <p><strong>🆔 Mã cuộc hẹn:</strong> {appointment.appointmentId}</p>
              <p><strong>📅 Ngày:</strong> {appointment.date}</p>
              <p><strong>🕒 Thời gian:</strong>
                {appointment.startTime ? appointment.startTime.slice(0, 5) : "Không rõ"} -
                {appointment.endTime ? appointment.endTime.slice(0, 5) : "Không rõ"}
              </p>

              <p><strong>📍 Địa điểm:</strong> {appointment.location}</p>
              <p><strong>👨‍⚕️ Tư vấn viên:</strong> {getConsultantName(appointment.consultantId)}</p>
              <p><strong>📌 Trạng thái:</strong> {appointment.status}</p>
            </div>
          ))}
        </div>

        <div className="feedback-history">
          <h2 className="tittle-thongtin">💬 Lịch sử phản hồi</h2>
          {feedbacks.length === 0 ? <p>Không có phản hồi nào.</p> : feedbacks.map((fb) => (
            <div key={fb.feedbackId} className="feedback-item">
              <p><strong>🆔 Mã phản hồi:</strong> {fb.feedbackId}</p>
              <p><strong>👨‍⚕️ Tư vấn viên:</strong> {getConsultantName(fb.consultantId)}</p>
              <p><strong>📅 Ngày gửi:</strong> {fb.date}</p>
              <p><strong>📝 Nội dung:</strong> {fb.content}</p>
            </div>
          ))}
        </div>
      </div>

      {showCourses && (
        <div className="popup-courses">
          <div className="popup-content">
            <h2>🎓 {profile.roleName === "CONSULTANT" ? "Lịch dạy của tôi" : "Danh sách khóa học của tôi"}</h2>
            <button className="btn-close" onClick={() => setShowCourses(false)}>❌ Đóng</button>

            {profile.roleName === "CONSULTANT" ? (
              consultantSessions.length === 0 ? (
                <p>Không có buổi học nào.</p>
              ) : (
                <ul>
                  {consultantSessions.map((session) => (
                    <li key={session.sessionId} className="course-item">
                      <h4>📘 Khóa học: {getCourseInfoById(session.courseId).tenKhoaHoc}</h4>
                      <p>🧩 Buổi {session.sessionIndex}</p>
                      <p>📅 Ngày: {new Date(session.sessionDate).toLocaleString()}</p>
                    </li>
                  ))}
                </ul>
              )
            ) : (
              myCourses.length === 0 ? (
                <p>Không có khóa học nào.</p>
              ) : (
                <ul>
                  {myCourses.map((course) => (
                    <li key={course.courseId} className="course-item">
                      <h3>🎓 {course.tenKhoaHoc}</h3>
                      <p><strong>📍 Địa điểm:</strong> {course.diaDiem}</p>
                      <p><strong>📅 Thời gian:</strong>
                        {new Date(course.thoiGianBatDau).toLocaleString()} → {new Date(course.thoiGianKetThuc).toLocaleString()}
                      </p>
                      <p><strong>👨‍⚕️ Tư vấn viên:</strong> {course.consultant?.name || "Không rõ"} ({course.consultant?.email || "N/A"})</p>
                      <button onClick={() => fetchSessionsForCourse(course.courseId)}>📖 Chi tiết buổi học</button>

                      {courseSessions[course.courseId] && (
                        <div className="session-list">
                          <h4>🗓️ Danh sách buổi học:</h4>
                          <ul>
                            {courseSessions[course.courseId].map((session) => (
                              <li key={session.sessionId}>
                                <p>🧩 Buổi {session.sessionIndex}</p>
                                <p>📅 Ngày: {new Date(session.sessionDate).toLocaleString()}</p>
                                <p>✅ Điểm danh: {
                                  session.isPresent === true ? "Có mặt" :
                                    session.isPresent === false ? "Vắng" : "Chưa điểm danh"
                                }</p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )
            )}

          </div>
        </div>
      )}
    </div>
  );
}
