// src/api/amenities.js
import axios from 'axios';

const API_URL = 'http://localhost:7154/api/amenities'; // Địa chỉ API của bạn

export const getAmenities = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data; // Trả về dữ liệu từ API
    } catch (error) {
        console.error('Lỗi khi lấy tiện nghi:', error);
        throw error; // Ném lỗi nếu có sự cố
    }
};
