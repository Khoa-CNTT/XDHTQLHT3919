import axios from 'axios';

const BASE_URL = 'https://localhost:7154/api/booking/detail';

// Lấy tất cả chi tiết đặt phòng
export const getAllBookingDetails = async () => {
  const response = await axios.get(`${BASE_URL}/all`);
  return response.data;
};

// Lấy chi tiết theo BookingId
export const getBookingDetailsByBookingId = async (idBooking) => {
  const response = await axios.get(`${BASE_URL}/getAllByBooking/${idBooking}`);
  return response.data;
};

// Thêm chi tiết đặt phòng
export const addBookingDetail = async (detail) => {
  const response = await axios.post(`${BASE_URL}/add`, detail);
  return response.data;
};

// Cập nhật ngày CheckIn / CheckOut
export const updateBookingDetailDates = async (id, dates) => {
  const response = await axios.put(`${BASE_URL}/update-dates/${id}`, dates);
  return response.data;
};

// Xóa chi tiết đặt phòng
export const deleteBookingDetail = async (id) => {
  const response = await axios.delete(`${BASE_URL}/delete/${id}`);
  return response.data;
};