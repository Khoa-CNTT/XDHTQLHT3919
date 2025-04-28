import axios from 'axios';

const API_URL = 'http://localhost:5000/api/booking'; // Địa chỉ API của backend

// Hàm gọi API để thêm đơn đặt phòng
export const addBooking = async (bookingData) => {
  try {
    const response = await axios.post(`${API_URL}/add`, bookingData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data; // Trả về dữ liệu sau khi đặt phòng thành công
  } catch (error) {
    console.error("Lỗi khi thêm đơn đặt phòng:", error);
    throw error; // Ném lỗi để xử lý ở component
  }
};

// Bạn có thể tạo thêm các API khác nếu cần, ví dụ: lấy tất cả đơn đặt phòng của người dùng.
export const getAllBookings = async () => {
  try {
    const response = await axios.get(`${API_URL}/all`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn đặt phòng:", error);
    throw error;
  }
};

// API lấy đơn đặt phòng theo ID
export const getBookingById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết đơn đặt phòng:", error);
    throw error;
  }
};

// API lấy tất cả đơn đặt phòng của người dùng theo ID
export const getBookingsByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy đơn đặt phòng của người dùng:", error);
    throw error;
  }
};
