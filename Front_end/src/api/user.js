import axios from "axios";

const API_URL = "https://localhost:7193/api/user";

// Lấy thông tin profile người dùng
const getProfile = (token, username) => {
  return axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Username: username,
    },
  });
};

// Cập nhật thông tin người dùng
const updateProfile = (token, data, username) => {
  return axios.put(`${API_URL}/me`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
      Username: username,
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

const userApi = {
  getProfile,
  updateProfile,
  changePassword,
};

export default userApi;
