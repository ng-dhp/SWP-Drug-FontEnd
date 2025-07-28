import API_ENDPOINTS from "../APIconfig";

export const fetchProfile = (token) => {
  return fetch(API_ENDPOINTS.PROFILE, {
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  }).then((res) => res.json());
};

export const updateProfile = (token, payload) => {
  return fetch(API_ENDPOINTS.UPDATE_PROFILE, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  }).then((res) => {
    if (!res.ok) throw new Error("Update failed");
    return res.json();
  });
};

export const fetchSurveyHistory = (token) =>
  fetch(API_ENDPOINTS.SURVEY_MY, {
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });

export const fetchRetakeRequests = (token) =>
  fetch(API_ENDPOINTS.VIEW_RETAKE_REQUESTS, {
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });


export const fetchAppointments = (token) =>
  fetch(API_ENDPOINTS.MY_APPOINTMENTS, {
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });

export const fetchFeedbackByUser = (userId, token) =>
  fetch(API_ENDPOINTS.FEEDBACK_USER(userId), {
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });

export const fetchConsultants = (token) =>
  fetch(API_ENDPOINTS.CONSULTANTS, {
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });

export const fetchCampaignSubmissions = (userId, token) =>
  fetch(API_ENDPOINTS.CAMPAIGN_SUBMISSIONS(userId), {
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });

export const fetchConsultantSessions = (consultantId, token) =>
  fetch(API_ENDPOINTS.CONSULTANT_SESSIONS(consultantId), {
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });

export const fetchAllCourses = (token) =>
  fetch(API_ENDPOINTS.ALL_COURSES, {
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });

export const fetchUserCourses = (userId, token) =>
  fetch(API_ENDPOINTS.MY_COURSES(userId), {
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });

export const fetchPayments = (token) =>
  fetch(API_ENDPOINTS.PAYMENTS, {
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });

export const createPayment = (courseId, userId, token) =>
  fetch(API_ENDPOINTS.CREATE_PAYMENT(courseId, userId), {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) => {
    if (!res.ok) throw new Error("Payment creation failed");
    return res.json();
  });

export const fetchCourseSessions = (courseId, userId, token) =>
  fetch(API_ENDPOINTS.COURSE_SESSIONS(courseId, userId), {
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  }).then((res) => res.json());
