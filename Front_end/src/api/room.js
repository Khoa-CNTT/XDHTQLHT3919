import axios from 'axios';

const API_BASE_URL = 'https://localhost:7193/api/Rooms';

export const fetchRoomDetails = async (roomId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${roomId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching room details:', error);
        throw new Error(`Không thể lấy dữ liệu phòng: ${error.response ? error.response.data : error.message}`);
    }
};

export const fetchRoomImages = async (roomId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${roomId}/images`);
        return response.data;
    } catch (error) {
        console.error('Error fetching room images:', error);
        throw new Error(`Không thể lấy hình ảnh phòng: ${error.response ? error.response.data : error.message}`);
    }
};

// Lấy tất cả dữ liệu phòng
export const fetchRoomsData = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching rooms data:', error);
        throw new Error(`Không thể lấy dữ liệu phòng: ${error.response ? error.response.data : error.message}`);
    }
};
