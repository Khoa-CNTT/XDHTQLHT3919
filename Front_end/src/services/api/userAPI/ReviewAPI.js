import axios from 'axios';

const API_URL = 'https://localhost:7154/api/review';

// Tạo axios instance có token
const getAxiosAuthInstance = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    baseURL: API_URL,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

// Lấy tất cả đánh giá (không cần token)
export const getAllReviews = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đánh giá:', error.response?.data || error.message);
    throw error;
  }
};

// Tạo đánh giá mới (cần token)
export const createReview = async (reviewData) => {
  try {
    const axiosAuth = getAxiosAuthInstance();

    const IdUser = localStorage.getItem("idUser"); // chú ý tên biến là IdUser theo BE
    if (!IdUser) throw new Error("Không tìm thấy ID người dùng trong localStorage.");

    const dataToSend = {
      ...reviewData,
      IdUser,   // phải đúng tên này để backend nhận được
      ParentReviewId: null, // tạo review mới thì ParentReviewId null
    };

    const response = await axiosAuth.post('/', dataToSend);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo đánh giá:', error.response?.data || error.message);
    throw error;
  }
};

// Trả lời đánh giá (cần token)
export const replyToReview = async (reviewId, replyData) => {
  try {
    const axiosAuth = getAxiosAuthInstance();

    const IdUser = localStorage.getItem("idUser");
    if (!IdUser) throw new Error("Không tìm thấy ID người dùng trong localStorage.");

    // Chuẩn hóa dữ liệu gửi lên backend theo Review model
    const dataToSend = {
      Comment: replyData.comment || "", // Bắt buộc phải có Comment
      IdUser: IdUser,
      Rating: 1,
    };

    console.log(`Reply review ${reviewId} với data:`, dataToSend);

    // Gọi API reply
    const response = await axiosAuth.post(`/reply/${reviewId}`, dataToSend);

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    throw error;
  }
};


// Cập nhật đánh giá (cần token)
export const updateReview = async (reviewId, reviewData) => {
  try {
    const axiosAuth = getAxiosAuthInstance();

    const dataToSend = {
      Comment: reviewData.comment,
      Rating: reviewData.rating ?? 1,
    }

    const response = await axiosAuth.put(`/${reviewId}`, dataToSend);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật đánh giá:', error.response?.data || error.message);
    throw error;
  }
};


// Xóa đánh giá (cần token)
export const deleteReview = async (reviewId) => {
  try {
    const axiosAuth = getAxiosAuthInstance();
    const response = await axiosAuth.delete(`/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa đánh giá:', error.response?.data || error.message);
    throw error;
  }
};
