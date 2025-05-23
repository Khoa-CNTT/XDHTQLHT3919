import React, { useEffect, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

import { getMonthlyRevenue} from '../../../services/api/adminAPI/homeAdmin';
import "../../../assets/Style/admin-css/dashboard.css";

const Dashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchRevenue = async () => {
      const res = await getMonthlyRevenue();
      // res.data là mảng 12 số, mỗi số là tổng doanh thu tháng i+1
      if (res && Array.isArray(res.data)) {
        // Chuyển thành mảng object { month, total }
        const chartData = res.data.map((total, idx) => ({
          month: idx + 1,
          total
        }));
        setData(chartData);
      }
    };
    fetchRevenue();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="chart-box">
        <h2>Thống kê doanh thu theo tháng ({new Date().getFullYear()})</h2>
        <ResponsiveContainer width="100%" height={500}>
          <AreaChart data={data}
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