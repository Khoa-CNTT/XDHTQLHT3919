import axios from 'axios';

const API_BASE_URL = 'https://localhost:7154/api/room';

const handleError = (error, message) => {
  console.error(message, error);
  throw new Error(`${message}: ${error.response?.data || error.message}`);
};

// Lấy tất cả phòng
export const fetchRoomsData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/all`);
    return response.data;
  } catch (error) {
    handleError(error, 'Không thể lấy dữ liệu danh sách phòng');
  }
};

// Lấy chi tiết phòng theo ID
export const fetchRoomDetails = async (roomId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${roomId}`);
    return response.data;
  } catch (error) {
    handleError(error, 'Không thể lấy chi tiết phòng');
  }
};
