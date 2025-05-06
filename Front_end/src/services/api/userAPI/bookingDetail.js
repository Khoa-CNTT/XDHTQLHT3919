import axios from 'axios';

const BASE_URL = 'https://localhost:7154/api/booking/detail';  // Địa chỉ API của bạn

// Lấy tất cả chi tiết đặt phòng
export const getAllBookingDetails = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/all`);
    return response.data;
  } catch (error) {
    console.error('Error fetching booking details:', error);
    throw error;
  }
};

// Thêm chi tiết đặt phòng
export const addBookingDetail = async (detail) => {
  try {
    const response = await axios.post(`${BASE_URL}/add`, detail);
    return response.data;
  } catch (error) {
    console.error('Error adding booking detail:', error);
    throw error;
  }
};

// Cập nhật ngày Check-In và Check-Out
export const updateBookingDetailDates = async (id, dates) => {
  try {
    const response = await axios.put(`${BASE_URL}/update-dates/${id}`, dates);
    return response.data;
  } catch (error) {
    console.error('Error updating booking detail dates:', error);
    throw error;
  }
};

// Xóa chi tiết đặt phòng
export const deleteBookingDetail = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting booking detail:', error);
    throw error;
  }
};

// Lấy chi tiết đặt phòng theo BookingId
export const getBookingDetailsByBookingId = async (idBooking) => {
  try {
    const response = await axios.get(`${BASE_URL}/getAllByBooking/${idBooking}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching booking details by booking ID:', error);
    throw error;
  }
};
