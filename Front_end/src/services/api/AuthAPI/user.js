import axios from 'axios';

// Base URL của API
const API_URL = process.env.REACT_APP_API_URL || 'https://localhost:7154/api/user';

// Lấy tất cả người dùng
const getAllUsers = async () => {
  const response = await axios.get(`${API_URL}/all`);
  return response.data;
};

// Thêm người dùng (dùng cho admin thêm mới hoặc đăng ký)
const addUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi thêm người dùng:', error);
    throw error;
  }
};

// Cập nhật thông tin người dùng (bao gồm cả thay đổi vai trò)
const updateUser = async (userData) => {
  try {
    // Gửi yêu cầu PUT để cập nhật người dùng, bao gồm thay đổi vai trò
    const response = await axios.put(`${API_URL}/edit`, userData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật người dùng:', error);
    throw error;
  }
};

// Xóa người dùng theo ID
const deleteUser = async (id) => {
  if (!id) {
    console.error('Invalid user ID');
    return;
  }

  try {
    // Gọi API xóa người dùng với đúng đường dẫn /api/user/{id}
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;  // Trả về kết quả từ API
  } catch (error) {
    console.error('Lỗi khi xóa người dùng:', error);
    throw error;  // Ném lỗi nếu có lỗi
  }
};

// Lấy thông tin người dùng từ token
const getProfile = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/info`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin người dùng:', error);
    throw error;
  }
};

// Cập nhật thông tin cá nhân
const updateProfile = async (token, data) => {
  try {
    const response = await axios.put(`${API_URL}/edit`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin cá nhân:', error);
    throw error;
  }
};

// Đổi mật khẩu
const changePassword = async (token, data, username) => {
  try {
    const response = await axios.put(`${API_URL}/change-password`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Username: username,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi đổi mật khẩu:', error);
    throw error;
  }
};

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
