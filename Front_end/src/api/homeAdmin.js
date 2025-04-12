import axios from 'axios';

const BASE_URL = 'https://localhost:7193/api/revenue';

export const getMonthlyRevenue = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/monthly`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thống kê doanh thu:', error);
    return [];
  }
};
