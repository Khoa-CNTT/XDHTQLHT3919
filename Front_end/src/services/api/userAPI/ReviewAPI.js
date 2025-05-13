import axios from 'axios';

const API_URL = 'https://localhost:7154/api/review';

const token = localStorage.getItem('token');
console.log(token)
// Tạo một instance của Axios có sẵn header Authorization nếu có token
const axiosAuth = axios.create({
  baseURL: API_URL,
  headers: token
    ? { Authorization: `Bearer ${token}` }
    : {},
});

// Lấy tất cả đánh giá (không cần token)
export const getAllReviews = async () => {
  try {
    const response = await axios.get(`${API_URL}/reviews`); // Đường dẫn này đã chính xác rồi
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đánh giá:", error);
    throw error;
  }
};

// Tạo mới một đánh giá (cần token)
export const createReview = async (reviewData) => {
  try {
    const response = await axiosAuth.post('/reviews', reviewData); // Đúng với BE
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo đánh giá:", error);
    throw error;
  }
};

// Trả lời một đánh giá (cần token)
export const replyToReview = async (reviewId, replyData) => {
  try {
    const response = await axiosAuth.post(`/reply/${reviewId}`, replyData); // Chỉnh lại đường dẫn cho đúng với BE
    return response.data;
  } catch (error) {
    console.error("Lỗi khi trả lời đánh giá:", error);
    throw error;
  }
};

// Cập nhật một đánh giá (cần token)
export const updateReview = async (reviewId, reviewData) => {
  try {
    const response = await axiosAuth.put(`/${reviewId}`, reviewData); // Đường dẫn đã chỉnh sửa đúng với BE
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật đánh giá:", error);
    throw error;
  }
};

// Xóa một đánh giá (cần token)
export const deleteReview = async (reviewId) => {
  try {
    const response = await axiosAuth.delete(`/${reviewId}`); // Đường dẫn đã chỉnh sửa đúng với BE
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa:', error.response ? error.response.data : error);
    throw error;
  }
};
