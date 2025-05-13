import axios from 'axios';

const API_URL = 'https://localhost:7154/api/booking';
const API_DETAIL_URL = 'https://localhost:7154/api/booking/detail';

// ====================== ĐƠN ĐẶT PHÒNG ======================

// Thêm đơn đặt phòng
export const addBooking = async (bookingData) => {
  try {
    const response = await axios.post(`${API_URL}/add`, bookingData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi thêm đơn đặt phòng:', error);
    throw error;
  }
};

// Lấy tất cả đơn đặt phòng
export const getAllBookings = async () => {
  try {
    const response = await axios.get(`${API_URL}/all`);
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đặt phòng:', error);
    throw error;
  }
};

// Lấy đơn đặt phòng theo ID
export const getBookingById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi lấy đơn đặt phòng theo ID:', error);
    throw error;
  }
};

// Lấy đơn theo user
export const getBookingsByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi lấy đơn theo user:', error);
    throw error;
  }
};

// Xác nhận đơn
export const confirmBooking = async (id) => {
  try {
    const response = await axios.put(`${API_URL}/confirm/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xác nhận đơn:', error);
    throw error;
  }
};

// Hủy đơn
export const cancelBooking = async (id) => {
  try {
    const response = await axios.put(`${API_URL}/cancel/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi hủy đơn:', error);
    throw error;
  }
};
// Cập nhật API để lấy tất cả thông tin booking cùng với chi tiết
export const getAllBookingsWithDetails = async () => {
  try {
    const response = await axios.get(`${API_URL}/all-with-details`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy tất cả thông tin booking và chi tiết:', error);
    throw error;
  }
};

// ====================== CHI TIẾT ĐẶT PHÒNG ======================

// Lấy toàn bộ chi tiết đơn đặt phòng
export const getAllBookingDetails = async () => {
  try {
    const response = await axios.get(`${API_DETAIL_URL}/all`);
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi lấy tất cả chi tiết đặt phòng:', error);
    throw error;
  }
};
