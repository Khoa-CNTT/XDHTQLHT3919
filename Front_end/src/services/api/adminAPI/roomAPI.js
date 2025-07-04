import axios from 'axios';

const API_URL = 'https://localhost:7154/api/room';
const token = localStorage.getItem('token');

// Cấu hình headers với token (nếu có)
const headers = {
  'Content-Type': 'application/json',
  ...(token && { 'Authorization': `Bearer ${token}` })  // Thêm Authorization Header nếu có token
};
const handleError = (error, message) => {
  console.error(message, error);
  throw new Error(`${message}: ${error.response?.data || error.message}`);
};

// Lấy danh sách phòng
export const getRooms = async () => {
  try {
    const res = await axios.get(`${API_URL}/all`, { headers });
    console.log("Dữ liệu trả về từ API:", res.data);  // Log dữ liệu trả về để kiểm tra cấu trúc

    // Kiểm tra cấu trúc dữ liệu trả về từ API
    if (res.data && res.data.data) {
      return res.data.data; 
    } else {
      throw new Error('Dữ liệu không hợp lệ từ API');
    }
  } catch (error) {
    console.error('Lỗi khi tải danh sách phòng:', error);
    if (error.response) {
      // Lỗi trả về từ server
      console.error('Lỗi từ server:', error.response.data);
    }
    throw error;
  }
};

// Thêm phòng mới
export const addRoom = async (room) => {
  try {
    const res = await axios.post(`${API_URL}/add`, room, { headers });
    return res.data;
  } catch (error) {
    console.error('Lỗi khi thêm phòng:', error);
    if (error.response) {
      console.error('Lỗi từ server:', error.response.data);
    }
    throw error;
  }
};

// Cập nhật thông tin phòng
export const updateRoom = async (room) => {
  try {
    const res = await axios.put(`${API_URL}/edit`, room, { headers });
    return res.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật phòng:', error);
    if (error.response) {
      console.error('Lỗi từ server:', error.response.data);
    }
    throw error;
  }
};

// Xoá phòng
export const deleteRoom = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`, { headers });
    return res.data;
  } catch (error) {
    console.error('Lỗi khi xoá phòng:', error);
    if (error.response) {
      console.error('Lỗi từ server:', error.response.data);
    }
    throw error;
  }
};
export const fetchRoomDetails = async (roomId) => {
  try {
    const response = await axios.get(`${API_URL}/${roomId}`);
    return response.data;
  } catch (error) {
    handleError(error, 'Không thể lấy chi tiết phòng');
  }
};
// services/api/adminAPI/roomAPI.js
export const checkRoomBooked = async (roomId, checkInDate, checkOutDate) => {
  try {
    const res = await axios.get(
      `${API_URL}/is-booked`,
      {
        params: { roomId, checkIn: checkInDate, checkOut: checkOutDate },
        headers
      }
    );
    return res.data.isBooked;
  } catch (error) {
    handleError(error, 'Không thể kiểm tra trạng thái phòng');
  }
};