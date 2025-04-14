import axios from "axios";

const API_URL = "https://localhost:7154/api/user";

// Lấy thông tin người dùng (dựa vào token)
const getProfile = (token) => {
  return axios.get(`${API_URL}/info`, {
    params: {
      token: `Bearer ${token}`,
    },
  });
};

// Cập nhật thông tin người dùng (gửi avatar hoặc form-data)
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
