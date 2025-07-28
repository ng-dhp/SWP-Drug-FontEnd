// src/api/apiService.js
import API_ENDPOINTS from "../APIconfig";

export const registerUser = async (userData) => {
    try {
        const response = await fetch(API_ENDPOINTS.REGISTER, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        const contentType = response.headers.get("content-type");

        if (!response.ok) {
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Lỗi không xác định");
            } else {
                const errorText = await response.text();
                throw new Error(errorText || "Lỗi không xác định");
            }
        }

        //Trả về JSON nếu có, hoặc text nếu không
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        } else {
            return await response.text(); // như "OTP sent to email"
        }
    } catch (error) {
        throw error;
    }
}

export const resetPasswordWithOtp = async ({ email, otp, newPassword }) => {
    try {
        const response = await fetch(API_ENDPOINTS.RESET_PASSWORD, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, otp, newPassword }),
        });

        const contentType = response.headers.get("content-type");

        if (!response.ok) {
            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                throw new Error(data.message || "Lỗi không xác định");
            } else {
                const text = await response.text();
                throw new Error(text || "Lỗi không xác định");
            }
        }

        return contentType && contentType.includes("application/json")
            ? await response.json()
            : await response.text(); // e.g. "Password reset successfully"
    } catch (error) {
        throw error;
    }
};
export const getUserSurveyRequests = async (token) => {
    const res = await fetch(API_ENDPOINTS.STAFF.SURVEY_REQUESTS, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Không thể lấy danh sách yêu cầu");
    return await res.json();
};

export const approveSurveyRequest = async (id, token) => {
    const res = await fetch(API_ENDPOINTS.STAFF.APPROVE_SURVEY(id), {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Chấp nhận thất bại");
    return await res.text();
};

export const rejectSurveyRequest = async (id, reason, token) => {
    const res = await fetch(API_ENDPOINTS.STAFF.REJECT_SURVEY(id, reason), {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Từ chối thất bại");
    return await res.text();
};



;
