import axios from 'axios';

// Base URL của API
const API_URL =  "https://localhost:7154/api/user";
// const API_URL = process.env.REACT_APP_API_URL || "https://localhost:7154/api/user";


// Lấy tất cả người dùng
const getAllUsers = async () => {
  const response = await axios.get(`${API_URL}/all`);
  return response.data;
};

// Thêm người dùng (dùng cho admin thêm mới hoặc đăng ký)
// user.js


const addUser = async (user) => {
  try {
    const formData = new FormData();
    formData.append('name', user.name);
    formData.append('email', user.email);
    formData.append('phone', user.phone);
    formData.append('password', user.password);
    formData.append('address', user.address);
    if (user.avatar) {
      formData.append('avatar', user.avatar);
    }

    const response = await axios.post(`${API_URL}/register`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Lỗi khi thêm người dùng:', error);
    throw error;
  }
};



// Cập nhật thông tin người dùng (bao gồm cả thay đổi vai trò)
const updateUser = async (token, formData) => {
  try {
    const response = await axios.put(`${API_URL}/edit`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data', // quan trọng
      },
    });
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

      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin cá nhân:', error);
    throw error;
  }
};


// Đổi mật khẩu
const changePassword = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/changepass`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data; // vì backend trả message + status
  } catch (error) {
    console.error('Lỗi khi đổi mật khẩu:', error);
    throw error;
  }
};
// Quên mật khẩu
const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
    return response.data; // Trả về dữ liệu phản hồi từ API
  } catch (error) {
    // Quản lý lỗi nếu API gọi thất bại
    throw error; // Ném lỗi ra ngoài để xử lý tiếp
  }
};


const resetPassword = async ({ token, newPassword, confirmPassword }) => {
  try {
    const response = await axios.post(`${API_URL}/reset-password?token=${token}`, {
      newPassword,
      confirmPassword,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi đổi mật khẩu:", error);
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
  forgotPassword,
  resetPassword,
};

export default userApi;
