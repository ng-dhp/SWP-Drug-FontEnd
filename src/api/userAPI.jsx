import API_ENDPOINTS from "../APIconfig";

export const fetchAllUsers = async (token) => {
  try {
    const response = await fetch(API_ENDPOINTS.PROFILE_ALL_USERS, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Lỗi khi fetch danh sách người dùng");
    return await response.json();
  } catch (error) {
    console.error("❌ fetchAllUsers Error:", error);
    throw error;
  }
};

export const updateUserRole = async (token, userId, newRole) => {
  try {
    const response = await fetch(`${API_ENDPOINTS.UPDATE_ROLE(userId)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ roleName: newRole }),
    });
    if (!response.ok) throw new Error("Lỗi khi cập nhật role");
    return await response.json();
  } catch (error) {
    console.error("❌ updateUserRole Error:", error);
    throw error;
  }
};
