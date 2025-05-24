import axios from 'axios';

const API_URL = 'https://localhost:7154/api/booking';

// Tạo đơn đặt phòng
export const addBooking = async (bookingData) => {
  const response = await axios.post(`${API_URL}/add`, bookingData, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

// Lấy tất cả đơn đặt phòng
export const getAllBookings = async () => {
  const response = await axios.get(`${API_URL}/all`);
  return response.data;
};

// Lấy đơn đặt phòng theo ID
export const getBookingById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Lấy các đơn đặt phòng theo ID người dùng
export const getBookingsByUserId = async (userId) => {
  const response = await axios.get(`${API_URL}/user/${userId}`);
  return response.data;
};

// Cập nhật trạng thái đơn đặt phòng
export const updateBookingEdit = async ({ idBooking, status }) => {
  // Truyền object { idBooking, status }
  const response = await axios.put(`${API_URL}/edit`, { idBooking, status }, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

// Xóa đơn đặt phòng theo ID
export const deleteBooking = async (id) => {
  const response = await axios.delete(`${API_URL}/delete/${id}`);
  return response.data;
};

// Xác nhận đơn đặt phòng
export const confirmBooking = async (idBooking) => {
  const response = await axios.put(`${API_URL}/confirm/${idBooking}`);
  return response.data;
};