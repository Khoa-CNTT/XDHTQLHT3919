import axios from 'axios';

const API_URL = 'https://localhost:7154/api/booking';

// Tạo đơn đặt phòng (BookingModel)
export const addBooking = async (bookingData) => {
  try {
    const response = await axios.post(`${API_URL}/add`, bookingData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data; // Trả về object chứa id Booking
  } catch (error) {
    console.error("Lỗi khi thêm đơn đặt phòng:", error.response?.data || error.message);
    throw error;
  }
};

// Lấy tất cả đơn đặt phòng
export const getAllBookings = async () => {
  try {
    const response = await axios.get(`${API_URL}/all`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn đặt phòng:", error);
    throw error;
  }
};

// Lấy đơn đặt phòng theo ID
export const getBookingById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết đơn đặt phòng:", error);
    throw error;
  }
};

// Lấy các đơn đặt phòng theo ID người dùng
export const getBookingsByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy đơn đặt phòng của người dùng:", error);
    throw error;
  }
};

// Cập nhật trạng thái đơn đặt phòng
export const updateBookingEdit = async (id, edit) => {
  try {
    const response = await axios.put(`${API_URL}/edit`, { id, edit }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái đơn đặt phòng:", error.response?.data || error.message);
    throw error;
  }
};

// Xóa đơn đặt phòng theo ID
export const deleteBooking = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa đơn đặt phòng:", error.response?.data || error.message);
    throw error;
  }
};