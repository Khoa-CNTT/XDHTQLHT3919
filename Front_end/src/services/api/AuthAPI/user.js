import axios from 'axios';

// Use environment variable for API base URL
const API_URL = process.env.REACT_APP_API_URL || 'https://localhost:7154/api/user';

const getAllUsers = async () => {
  const response = await axios.get(`${API_URL}/all`);
  return response.data; // Vì response.data là mảng
};

// Thêm người dùng (dùng trong đăng ký hoặc thêm từ admin)
const addUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi thêm người dùng:', error);
    throw error;
  }
};

// Cập nhật người dùng (admin cập nhật thông tin)
const updateUser = async (id, userData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật người dùng:', error);
    throw error;
  }
};

// Xóa người dùng
const deleteUser = async (id) => {
  if (!id) {
    console.error('Invalid user ID');
    return;
  }

  try {
    // Gọi API xóa người dùng với id
    const response = axios.delete(`${API_URL}/user/${id}`);
    return response.data;  // Trả về kết quả từ API
  } catch (error) {
    console.error('Lỗi khi xóa người dùng:', error);
    throw error;  // Ném lỗi nếu có lỗi
  }
};



// --- Các API cần token ---

// Lấy thông tin người dùng từ token
const getProfile = (token) => {
  return axios.get(`${API_URL}/info?token=${token}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Cập nhật thông tin cá nhân (nếu có endpoint riêng)
const updateProfile = (token, data) => {
  return axios.put(`${API_URL}/edit`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

// Đổi mật khẩu người dùng
const changePassword = (token, data, username) => {
  return axios.put(`${API_URL}/change-password`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Username: username,
    },
  });
};

// --- Export API ---
const userApi = {
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
  changePassword,
};

export default userApi;
