import React, { useEffect, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

import { getMonthlyRevenue } from '../../../services/api/adminAPI/homeAdmin';
import "../../../assets/Style/admin-css/dashboard.css";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [years, setYears] = useState([]);

  useEffect(() => {
    const fetchRevenue = async () => {
      const revenueData = await getMonthlyRevenue();
      setData(revenueData);

      // Lấy danh sách năm từ dữ liệu
      const yearList = [...new Set(revenueData.map(item => item.year))];
      setYears(yearList.sort((a, b) => b - a)); // Sắp xếp giảm dần
    };

    fetchRevenue();
  }, []);

  const filteredData = data.filter(item => item.year === selectedYear);

  return (
    <div className="dashboard-container">
      <div className="chart-box">
        <h2>Thống kê doanh thu theo tháng</h2>

        {/* Bộ chọn năm */}
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="year-select">Chọn năm: </label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <ResponsiveContainer width="100%" height={500}>
          <AreaChart data={filteredData}
            margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4facfe" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#00f2fe" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" label={{ value: "Tháng", position: "insideBottomRight", offset: -5 }} />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip formatter={(value) => new Intl.NumberFormat().format(value) + ' đ'} />
            <Area type="monotone" dataKey="total" stroke="#4facfe" fillOpacity={1} fill="url(#colorTotal)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
