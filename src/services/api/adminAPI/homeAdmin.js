import axios from 'axios';

export const getMonthlyRevenue = async () => {
  const res = await axios.get('https://localhost:7154/api/thongke/doanhthu');
  // Trả về mảng số: res.data.data
  return res.data;
};
export const getYearRevenue = async (year) => {
  const res = await axios.get(`https://localhost:7154/api/thongke/doanhthu?year=${year}`);
  return res.data;
};
// Lấy top 5 phòng được đặt nhiều nhất
export const getTopRooms = async () => {
  const res = await axios.get('https://localhost:7154/api/thongke/topphong');
  // Trả về mảng phòng: res.data.data
  return res.data;
};