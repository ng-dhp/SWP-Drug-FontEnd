import API_ENDPOINTS from "../APIconfig";

// Đăng ký tài khoản
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
      // Nếu là JSON thì parse, còn không thì lấy text
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Đăng ký thất bại");
      } else {
        const errorText = await response.text();
        throw new Error(errorText || "Đăng ký thất bại");
      }
    }

    // ✅ Nếu response là JSON thì parse, không thì lấy text
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      return await response.text(); // như "OTP sent to email"
    }
  } catch (error) {
    console.error("❌ Lỗi khi gọi API register:", error);
    throw error;
  }
};
