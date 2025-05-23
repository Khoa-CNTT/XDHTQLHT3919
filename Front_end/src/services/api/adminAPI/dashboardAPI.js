// src/services/api/adminAPI/dashboardAPI.js

export const getMonthlyRevenue = async () => {
  return [
    { month: '1', year: 2025, total: 10000000 },
    { month: '2', year: 2025, total: 12000000 },
    { month: '3', year: 2025, total: 9000000 },
    { month: '4', year: 2025, total: 15000000 },
    { month: '5', year: 2025, total: 17000000 },
    { month: '6', year: 2025, total: 14000000 },
    { month: '7', year: 2025, total: 16000000 },
    { month: '8', year: 2025, total: 18000000 },
    { month: '9', year: 2025, total: 19000000 },
    { month: '10', year: 2025, total: 20000000 },
    { month: '11', year: 2025, total: 22000000 },
    { month: '12', year: 2025, total: 25000000 },
  ];
};

// ✅ Mock dữ liệu top 5 phòng được đặt nhiều nhất
export const getTopBookedRooms = async () => {
  return [
    { roomId: '1a', roomName: 'Phòng Deluxe A1', totalBookings: 120 },
    { roomId: '2b', roomName: 'Phòng Suite VIP', totalBookings: 98 },
    { roomId: '3c', roomName: 'Phòng Đôi Tiêu Chuẩn', totalBookings: 87 },
    { roomId: '4d', roomName: 'Phòng Gia Đình', totalBookings: 76 },
    { roomId: '5e', roomName: 'Phòng Đơn Nhỏ', totalBookings: 65 },
  ];
};
