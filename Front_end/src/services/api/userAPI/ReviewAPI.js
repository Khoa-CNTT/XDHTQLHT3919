import axios from 'axios';

const API_URL = 'https://localhost:7154/api/review';

// Hàm lấy cấu hình Authorization từ localStorage
const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token không hợp lệ');
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Lấy tất cả các đánh giá
export const getAllReviews = async () => {
  try {
    const res = await axios.get(API_URL, getAuthConfig());
    return res.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    if (error.response && error.response.data) {
      console.error('Error details:', error.response.data);
    }
    throw error;
  }
};

// Tạo đánh giá mới
export const createReview = async (reviewData) => {
  console.log("Review Data Sent:", reviewData);  // Kiểm tra dữ liệu gửi đi
  try {
    const res = await axios.post(API_URL, reviewData, getAuthConfig());
    return res.data;
  } catch (error) {
    console.error('Error creating review:', error);
    if (error.response && error.response.data) {
      console.error('Error details:', error.response.data.errors || error.response.data);
    }
    throw error;
  }
};

// Trả lời đánh giá
export const replyToReview = async (reviewId, replyData) => {
  try {
    const res = await axios.post(`${API_URL}/reply/${reviewId}`, replyData, getAuthConfig());
    return res.data;
  } catch (error) {
    console.error('Error replying to review:', error);
    if (error.response && error.response.data) {
      console.error('Error details:', error.response.data.errors || error.response.data);
    }
    throw error;
  }
};

// Cập nhật đánh giá
export const updateReview = async (reviewId, reviewData) => {
  try {
    const res = await axios.put(`${API_URL}/${reviewId}`, reviewData, getAuthConfig());
    return res.data;
  } catch (error) {
    console.error('Error updating review:', error);
    if (error.response) {
      if (error.response.status === 400) {
        console.error('Bad Request: Invalid data or missing parameters.');
        console.error('Error details:', error.response.data.errors || error.response.data);
      }
    }
    throw error;
  }
};

// Xóa đánh giá
export const deleteReview = async (reviewId) => {
  try {
    const res = await axios.delete(`${API_URL}/${reviewId}`, getAuthConfig());
    return res.data;
  } catch (error) {
    console.error('Error deleting review:', error);
    if (error.response && error.response.data) {
      console.error('Error details:', error.response.data.errors || error.response.data);
    }
    throw error;
  }
};
