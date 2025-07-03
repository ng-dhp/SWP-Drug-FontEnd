import React, { useEffect, useState } from "react";
import "./cssCom/profile.css";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [surveyHistory, setSurveyHistory] = useState([]);
  const [requestHistory, setRequestHistory] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [appointment, setAppointment] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editData, setEditData] = useState({
    name: "",
    specialization: "",
    yob: "",
    phone: "",
    gender: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("http://localhost:8080/api/v1.0/profile", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);

        if (data.roleName === "CONSULTANT") {
          setEditData({
            name: data.fullName || "",
            specialization: data.specialization || "",
            yob: data.yob || "",
            phone: data.phone || "",
          });
        } else if (data.roleName === "USER") {
          setEditData({
            name: data.fullName || "",
            yob: data.yob || "",
            gender: data.gender || "",
            phone: data.phone || "",
          });
        }

        const userId = data.userId;

        return Promise.all([
          fetch("http://localhost:8080/api/v1.0/survey-template/my", {
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:8080/api/v1.0/my-requests/view-request-retake-survey", {
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:8080/api/v1.0/appointment/myAppointment", {
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          }),
          fetch(`http://localhost:8080/api/v1.0/feedback/user/${userId}`, {
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:8080/api/v1.0/consultant/getAllConsultant", {
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          }),
        ]);
      })
      .then(async ([surveyRes, requestRes, apptRes, fbRes, consultantRes]) => {
        const survey = await surveyRes.json();
        const requests = await requestRes.json();
        const apptList = await apptRes.json();
        const fb = await fbRes.json();
        const consultants = await consultantRes.json();

        setSurveyHistory(Array.isArray(survey) ? survey : []);
        setRequestHistory(Array.isArray(requests) ? requests : []);
        setAppointments(Array.isArray(apptList) ? apptList : []);
        setAppointment(Array.isArray(apptList) && apptList.length > 0 ? apptList[0] : null);
        setFeedbacks(Array.isArray(fb) ? fb : []);
        setConsultants(Array.isArray(consultants) ? consultants : []);

        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi tải dữ liệu:", err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Vui lòng đăng nhập lại.");

    let payload = {};
    if (profile.roleName === "CONSULTANT") {
      payload = {
        fullName: editData.name,
        specialization: editData.specialization,
        yob: parseInt(editData.yob),
        phone: editData.phone,
      };
    } else if (profile.roleName === "USER") {
      payload = {
        fullName: editData.name,
        yob: parseInt(editData.yob),
        gender: editData.gender,
        phone: editData.phone,
      };
    }

    fetch("http://localhost:8080/api/v1.0/update-my-profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Cập nhật thất bại");
        return res.json();
      })
      .then(() => {
        alert("✅ Cập nhật thành công!");
        setProfile((prev) => ({
          ...prev,
          fullName: editData.name,
          specialization: editData.specialization || prev.specialization,
          yob: editData.yob,
          gender: editData.gender || prev.gender,
          phone: editData.phone,
        }));
        setIsEditing(false);
      })
      .catch((err) => {
        console.error("Lỗi cập nhật:", err);
        alert("❌ Cập nhật thất bại.");
      });
  };

  const getConsultantName = (id) => {
    const c = consultants.find((c) => c.consultantId === id);
    return c ? c.name : `ID ${id}`;
  };

  if (loading) return <div className="text-center mt-10">Đang tải...</div>;
  if (!profile) return <div className="text-center mt-10 text-red-500">Không có dữ liệu</div>;

  return (
    <div className="profile-container">
      <h2 className="tittle-thongtin">Thông tin cá nhân</h2>
      <ul className="thongtin">
        <li><strong>👤 Họ tên:</strong> {profile.fullName}</li>
        <li><strong>📧 Email:</strong> {profile.email}</li>
        <li><strong>🎂 Năm sinh:</strong> {profile.yob}</li>
        <li><strong>⚥ Giới tính:</strong> {profile.gender === "Male" ? "Nam" : "Nữ"}</li>
        <li><strong>📱 Số điện thoại:</strong> {profile.phone}</li>
        <li><strong>🛡️ Vai trò:</strong> {profile.roleName}</li>
      </ul>

      {profile.roleName === "CONSULTANT" && (
        <div className="consultant-edit">
          <h3>🛠️ Cập nhật thông tin tư vấn viên</h3>
          <label>Họ tên:<input type="text" name="name" value={editData.name} onChange={handleChange} /></label>
          <label>Chuyên ngành:<input type="text" name="specialization" value={editData.specialization} onChange={handleChange} /></label>
          <label>Năm sinh:<input type="number" name="yob" value={editData.yob} onChange={handleChange} /></label>
          <label>Số điện thoại:<input type="text" name="phone" value={editData.phone} onChange={handleChange} /></label>
          <button className="btn-update" onClick={handleUpdate}>💾 Lưu thông tin</button>
        </div>
      )}

      {profile.roleName === "USER" && (
        <div className="user-edit">
          <h3>🛠️ Cập nhật thông tin cá nhân</h3>
          <label>Họ tên:<input type="text" name="name" value={editData.name} onChange={handleChange} /></label>
          <label>Năm sinh:<input type="number" name="yob" value={editData.yob} onChange={handleChange} /></label>
          <label>Giới tính:
            <select name="gender" value={editData.gender || ""} onChange={handleChange}>
              <option value="">-- Chọn giới tính --</option>
              <option value="Male">Nam</option>
              <option value="Female">Nữ</option>
            </select>
          </label>
          <label>Số điện thoại:<input type="text" name="phone" value={editData.phone} onChange={handleChange} /></label>
          <button className="btn-update" onClick={handleUpdate}>💾 Lưu thông tin</button>
        </div>
      )}

      <button className="btn-back-home" onClick={() => (window.location.href = "/")}>🏠 Quay về trang chủ</button>

      <div className="history-columns">
        <div className="survey-history">
          <h2 className="tittle-thongtin">📝 Lịch sử khảo sát</h2>
          {surveyHistory.length === 0 ? <p>Không có bài khảo sát nào được thực hiện.</p> : (
            surveyHistory.map((survey) => (
              <div key={survey.surveyId} className="survey-item">
                <h3>{survey.surveyType} - {survey.status}</h3>
                <p><strong>📅 Ngày làm:</strong> {survey.takenDate}</p>
                <p><strong>🧮 Tổng điểm:</strong> {survey.totalScore}</p>
                <p><strong>🩺 Đánh giá:</strong> {survey.recommendation || "Chưa có"}</p>
                <details>
                  <summary>📋 Xem chi tiết câu trả lời</summary>
                  <ul>
                    {(survey.answers || []).map((ans) => (
                      <li key={ans.questionId}>
                        <strong>Câu {ans.questionId}:</strong> {ans.questionText}<br />
                        <em>Trả lời:</em> {ans.answerText || "Chưa trả lời"} | <em>Điểm:</em> {ans.score}
                      </li>
                    ))}
                  </ul>
                </details>
              </div>
            ))
          )}
        </div>

        <div className="request-history">
          <h2 className="tittle-thongtin">📨 Lịch sử yêu cầu làm lại khảo sát</h2>
          {requestHistory.length === 0 ? <p>Không có yêu cầu nào.</p> : (
            requestHistory.map((req) => (
              <div key={req.id} className="request-item">
                <p><strong>📄 Mã yêu cầu:</strong> {req.id}</p>
                <p><strong>📘 Tên khảo sát:</strong> {req.name}</p>
                <p><strong>🗓 Ngày yêu cầu:</strong> {new Date(req.requestDate).toLocaleString()}</p>
                <p><strong>🧾 Lý do:</strong> {req.reason}</p>
                <p><strong>📌 Trạng thái:</strong> {req.status}</p>
                {req.status === "REJECTED" && (
                  <p><strong>❌ Lý do từ chối:</strong> {req.rejectionReason || "Không có"}</p>
                )}
              </div>
            ))
          )}
        </div>

        <div className="appointment-history">
          <h2 className="tittle-thongtin">📅 Lịch sử cuộc hẹn tư vấn</h2>
          {appointments.length === 0 ? (
            <p>Không có cuộc hẹn nào.</p>
          ) : (
            appointments.map((appointment) => (
              <div key={appointment.appointmentId} className="appointment-item">
                <p><strong>🆔 Mã cuộc hẹn:</strong> {appointment.appointmentId}</p>
                <p><strong>📅 Ngày:</strong> {appointment.date}</p>
                <p><strong>🕒 Thời gian:</strong> {appointment.startTime} - {appointment.endTime}</p>
                <p><strong>📍 Địa điểm:</strong> {appointment.location}</p>
                <p><strong>📌 Trạng thái:</strong> {appointment.status}</p>
              </div>
            ))
          )}
        </div>

        <div className="feedback-history">
          <h2 className="tittle-thongtin">💬 Lịch sử phản hồi</h2>
          {feedbacks.length === 0 ? <p>Không có phản hồi nào.</p> : (
            feedbacks.map((fb) => (
              <div key={fb.feedbackId} className="feedback-item">
                <p><strong>🆔 Mã phản hồi:</strong> {fb.feedbackId}</p>
                <p><strong>👨‍⚕️ Tư vấn viên:</strong> {getConsultantName(fb.consultantId)}</p>
                <p><strong>📅 Ngày gửi:</strong> {fb.date}</p>
                <p><strong>📝 Nội dung:</strong> {fb.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
