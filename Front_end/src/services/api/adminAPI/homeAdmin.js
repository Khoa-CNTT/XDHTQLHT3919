export const getMonthlyRevenue = async () => {
  // Dữ liệu thống kê 2 năm: 2024 và 2025
  const mockData = [
    { month: 'Tháng 1', year: 2025, total: 0 },
    { month: 'Tháng 2', year: 2025, total: 0 },
    { month: 'Tháng 3', year: 2025, total: 0 },
    { month: 'Tháng 4', year: 2025, total: 11000000 },
    { month: 'Tháng 5', year: 2025, total: 16000000 },
    { month: 'Tháng 6', year: 2025, total: 0 },
    { month: 'Tháng 7', year: 2025, total: 0 },
    { month: 'Tháng 8', year: 2025, total: 0 },
    { month: 'Tháng 9', year: 2025, total: 0 },
    { month: 'Tháng 10', year: 2025, total: 0 },
    { month: 'Tháng 11', year: 2025, total: 0 },
    { month: 'Tháng 12', year: 2025, total: 0 },

    { month: 'Tháng 1', year: 2024, total: 10000000 },
    { month: 'Tháng 2', year: 2024, total: 7000000 },
    { month: 'Tháng 3', year: 2024, total: 9500000 },
    { month: 'Tháng 4', year: 2024, total: 8500000 },
    { month: 'Tháng 5', year: 2024, total: 11000000 },
    { month: 'Tháng 6', year: 2024, total: 7600000 },
    { month: 'Tháng 7', year: 2024, total: 9900000 },
    { month: 'Tháng 8', year: 2024, total: 10400000 },
    { month: 'Tháng 9', year: 2024, total: 11700000 },
    { month: 'Tháng 10', year: 2024, total: 12300000 },
    { month: 'Tháng 11', year: 2024, total: 7800000 },
    { month: 'Tháng 12', year: 2024, total: 14000000 },
  ];

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData);
    }, 500);
  });
};
