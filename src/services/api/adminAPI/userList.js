import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://localhost:7154/api/user';

// Lấy tất cả người dùng
const getAllUsers = async () => {
  const response = await axios.get(`${API_URL}/all`);
  return response.data;
};

// Thêm người dùng
const addUser = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

// Cập nhật người dùng (dùng PUT /edit)
const updateUser = async (userData) => {
  const response = await axios.put(`${API_URL}/edit`, userData);
  return response.data;
};

// Xóa người dùng (dùng DELETE /delete với id trong body)
const deleteUser = async (id) => {
  const response = await axios.delete(`${API_URL}/delete`, {
    data: id,
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

const userApi = {
  getAllUsers,
  addUser,
  updateUser,
  deleteUser
};

export default userApi;
