const BASE_URL = "http://localhost:8080/api/v1.0";

const API_ENDPOINTS = {
  LOGIN: `${BASE_URL}/login`,
  REGISTER: `${BASE_URL}/register`,
  FORGOT_PASSWORD: `${BASE_URL}/forgot-password`,
  SEND_OTP: `${BASE_URL}/send-reset-otp`,
  RESET_PASSWORD: `${BASE_URL}/reset-password`,
  VERIFY_OTP: `${BASE_URL}/verify-otp`,
  PROFILE: `${BASE_URL}/profile`,
  UPDATE_PROFILE: `${BASE_URL}/update-my-profile`,
  SURVEY_MY: `${BASE_URL}/survey-template/my`,
  MY_APPOINTMENTS: `${BASE_URL}/appointment/myAppointment`,
  FEEDBACK_USER: (userId) => `${BASE_URL}/feedback/user/${userId}`,
  CONSULTANTS: `${BASE_URL}/consultant/getAllConsultant`,
  CAMPAIGN_SUBMISSIONS: (userId) =>
    `${BASE_URL}/campaigns/1/submissions/review?userId=${userId}`,
  MY_COURSES: (userId) => `${BASE_URL}/khoahoc/khoahoc-cuatoi/${userId}`,
  CONSULTANT_SESSIONS: (consultantId) =>
    `${BASE_URL}/khoahoc/consultant/${consultantId}/sessions`,
  COURSE_REGISTER: (courseId, userId) => `${BASE_URL}/khoahoc/dangky/${courseId}?userId=${userId}`,

  VIEW_RETAKE_REQUESTS: `${BASE_URL}/my-requests/view-request-retake-survey`,


  ALL_COURSES: `${BASE_URL}/khoahoc/all`,
  PAYMENTS: `${BASE_URL}/payments/all`,
  CREATE_PAYMENT: (courseId, userId) =>
    `${BASE_URL}/payments/course/${courseId}/user/${userId}`,
  COURSE_SESSIONS: (courseId, userId) =>
    `${BASE_URL}/khoahoc/${courseId}/sessions?userId=${userId}`,
  PROFILE_ALL_USERS: `${BASE_URL}/profileAllUser`,
  UPDATE_ROLE: (userId) => `${BASE_URL}/${userId}/roles`,
  START_ASSIST_SURVEY: (templateId = 1) =>
    `${BASE_URL}/survey-template/start?templateId=${templateId}`,
  
  SUBMIT_ASSIST_SURVEY: (surveyId) =>
    `${BASE_URL}/survey-template/survey/${surveyId}/submit`,

  START_CRAFFT_SURVEY: (templateId = 2) =>
    `${BASE_URL}/survey-template/start?templateId=${templateId}`,

  SUBMIT_CRAFFT_SURVEY: (surveyId) =>
    `${BASE_URL}/survey-template/survey/${surveyId}/submit`,

  CREATE_COURSE: `${BASE_URL}/khoahoc`,

  FEEDBACK_CONSULTANT: `${BASE_URL}/feedback/consultant`,

  DASHBOARD_RESOLVED_REQUESTS: `${BASE_URL}/admin/dashboard/get-surveys-requests-resolved`,

ALL_CONSULTANTS: `${BASE_URL}/consultant/getAllConsultant`,
STUDENTS_BY_CONSULTANT: (consultantId) =>
  `${BASE_URL}/khoahoc/danhsach-dangky/${consultantId}`,
ALL_COURSES: `${BASE_URL}/khoahoc/all`,
SESSIONS_BY_CONSULTANT: (consultantId) =>
  `${BASE_URL}/khoahoc/consultant/${consultantId}/sessions`,
SESSIONS_BY_COURSE_AND_USER: (courseId, userId) =>
  `${BASE_URL}/khoahoc/${courseId}/sessions?userId=${userId}`,
DIEM_DANH: `${BASE_URL}/khoahoc/session/diemdanh`,

GET_ALL_TEMPLATES_ADMIN: `${BASE_URL}/admin/dashboard/getAll-templates-admin`,

  
    CAMPAIGN_ALL: `${BASE_URL}/campaigns/all`,
    CAMPAIGN_STATUS: (campaignId, userId) => `${BASE_URL}/campaigns/${campaignId}/status?userId=${userId}`,
    CAMPAIGN_BY_ID: (campaignId) => `${BASE_URL}/campaigns/${campaignId}`,
    SUBMIT_CAMPAIGN_SURVEY: (campaignId, userId) => `${BASE_URL}/campaigns/${campaignId}/submit?userId=${userId}`,
  

    DASHBOARD: {
  GET_ALL_SURVEYS: `${BASE_URL}/admin/dashboard/getAll-surveys`,
  SURVEY_DETAIL: (surveyId) => `${BASE_URL}/admin/dashboard/surveyDetail/${surveyId}`,
},

FEEDBACK_CONSULTANT_CREATE: `${BASE_URL}/feedback/consultant/create`,
PROFILE: `${BASE_URL}/profile`,
ALL_CONSULTANTS: `${BASE_URL}/consultant/getAllConsultant`,

REQUEST_RETAKE_SURVEY: (templateId = 1, reason = "") =>
  `${BASE_URL}/my-requests/retake-survey?templateId=${templateId}&reason=${encodeURIComponent(reason)}`,



  STAFF: {
    SURVEY_REQUESTS: `${BASE_URL}/staff/survey/get-user-requests`,
    APPROVE_SURVEY: (id) => `${BASE_URL}/staff/survey/request/${id}/approve`,
    REJECT_SURVEY: (id, reason) =>
      `${BASE_URL}/staff/survey/request/${id}/reject?rejectionReason=${encodeURIComponent(reason)}`,
  },


// Appointment (Lịch hẹn)
APPOINTMENTS_BY_CONSULTANT: (consultantId) => `${BASE_URL}/appointment/consultant/${consultantId}`,
UPDATE_APPOINTMENT_STATUS: (appointmentId, status) =>
  `${BASE_URL}/appointment/consultant/update-status/${appointmentId}?status=${status}`,

CAMPAIGN: {
  ALL: `${BASE_URL}/campaigns/all`,
  TOGGLE: (campaignId) => `${BASE_URL}/campaigns/${campaignId}/toggle`,
},

COURSE_UPDATE_ACTIVE: `${BASE_URL}/khoahoc/update-active`,


GET_ALL_TEMPLATES_ADMIN: `${BASE_URL}/admin/dashboard/getAll-templates-admin`,
TOGGLE_TEMPLATE_ACTIVE: (templateId) => `${BASE_URL}/admin/dashboard/template-toggle/${templateId}`,


CHECK_SLOT_AVAILABILITY: (consultantId, date, time) =>
  `${BASE_URL}/appointment/check-slot-availability?consultantId=${consultantId}&date=${date}&startTime=${time}`,

CREATE_APPOINTMENT: `${BASE_URL}/appointment/create`,

UPDATE_PAYMENT_STATUS: (paymentId, status = "SUCCESS") =>
  `${BASE_URL}/payments/${paymentId}/status?status=${status}`,

  

};

export default API_ENDPOINTS;