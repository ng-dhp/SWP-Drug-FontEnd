// src/api/APIconfig.jsx
const BASE_URL = "http://localhost:8080/api/v1.0";

const API_ENDPOINTS = {
  LOGIN: `${BASE_URL}/login`,
  REGISTER: `${BASE_URL}/register`,
  FORGOT_PASSWORD: `${BASE_URL}/forgot-password`,
  SEND_OTP: `${BASE_URL}/send-reset-otp`,
  VERIFY_OTP: `${BASE_URL}/verify-otp`,
  PROFILE: `${BASE_URL}/profile`,
  UPDATE_PROFILE: `${BASE_URL}/update-my-profile`,
  SURVEY_MY: `${BASE_URL}/survey-template/my`,
  REQUEST_RETAKE_SURVEY: `${BASE_URL}/my-requests/view-request-retake-survey`,
  MY_APPOINTMENTS: `${BASE_URL}/appointment/myAppointment`,
  FEEDBACK_USER: (userId) => `${BASE_URL}/feedback/user/${userId}`,
  CONSULTANTS: `${BASE_URL}/consultant/getAllConsultant`,
  CAMPAIGN_SUBMISSIONS: (userId) =>
    `${BASE_URL}/campaigns/1/submissions/review?userId=${userId}`,
  MY_COURSES: (userId) => `${BASE_URL}/khoahoc/khoahoc-cuatoi/${userId}`,
  CONSULTANT_SESSIONS: (consultantId) =>
    `${BASE_URL}/khoahoc/consultant/${consultantId}/sessions`,
  ALL_COURSES: `${BASE_URL}/khoahoc/all`,
  PAYMENTS: `${BASE_URL}/payments/all`,
  CREATE_PAYMENT: (courseId, userId) =>
    `${BASE_URL}/payments/course/${courseId}/user/${userId}`,
  COURSE_SESSIONS: (courseId, userId) =>
    `${BASE_URL}/khoahoc/${courseId}/sessions?userId=${userId}`,
  PROFILE_ALL_USERS: `${BASE_URL}/profileAllUser`,
  UPDATE_ROLE: (userId) => `${BASE_URL}/${userId}/roles`,
};

export default API_ENDPOINTS;
