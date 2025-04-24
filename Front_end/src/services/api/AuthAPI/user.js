import axios from "axios";

const API_URL = "https://localhost:7154/api/user";

// Lấy thông tin người dùng (dựa vào token)
const getProfile = (token) => {
  return axios.get(`${API_URL}/info`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ✅ Cập nhật thông tin người dùng (không dùng form-data)
const updateProfile = (token, data) => {
  return axios.put(`${API_URL}/edit`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

// Đổi mật khẩu người dùng
const changePassword = (token, data, username) => {
  return axios.put(`${API_URL}/change-password`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Username: username,
    },
  });
};

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/getall`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách người dùng:', error);
    throw error;
  }
};

const userApi = {
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
};

export default userApi;