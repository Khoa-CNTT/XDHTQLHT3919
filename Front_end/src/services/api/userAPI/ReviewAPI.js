import axios from 'axios';

const API_URL = 'https://localhost:7154/api/review';

export const getReviews = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching reviews:", error.response?.data || error.message);
        throw new Error('Không thể tải danh sách đánh giá.');
    }
};

export const createReview = async (reviewData) => {
    try {
        const response = await axios.post(API_URL, reviewData);
        return response.data;
    } catch (error) {
        console.error("Error creating review:", error.response?.data || error.message);
        throw new Error('Không thể thêm đánh giá.');
    }
};

export const deleteReview = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error("Error deleting review:", error.response?.data || error.message);
        throw new Error('Không thể xóa đánh giá.');
    }
};
