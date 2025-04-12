import axios from 'axios';

const API_URL = 'https://localhost:7145/api/rooms';

export const getGalleryImages = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy ảnh thư viện:', error);
        throw error;
    }
};
