import React, { useEffect, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';


import {
  getMonthlyRevenue,
  getTopBookedRooms
} from '../../../services/api/adminAPI/dashboardAPI'; // LẤY TOP PHÒNG

import "../../../assets/Style/admin-css/dashboard.css";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [topRooms, setTopRooms] = useState([]);
  const [showTopRooms, setShowTopRooms] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // Lấy doanh thu
      const res = await getMonthlyRevenue();
      if (res && Array.isArray(res.data)) {
        const chartData = res.data.map((total, idx) => ({
          month: idx + 1,
          total
        }));
        setData(chartData);
      }

      // Lấy top 5 phòng
      const roomData = await getTopBookedRooms();
      setTopRooms(roomData);
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="chart-box">
        <button
          onClick={() => setShowTopRooms(!showTopRooms)}
          className="toggle-button"
        >
          {showTopRooms ? "Xem thống kê doanh thu" : "Xem Top 5 phòng"}
        </button>
      </div>

      {!showTopRooms ? (
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
      ) : (
        <div className="chart-box">
          <h2>Top 5 phòng được đặt nhiều nhất</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topRooms} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 5 }}>
              <XAxis type="number" />
              <YAxis dataKey="roomName" type="category" />
              <Tooltip
                formatter={(value, name, props) =>
                  [`${value} lượt đặt`, `${props.payload.roomName} (ID: ${props.payload.roomId})`]
                }
              />
              <Bar dataKey="totalBookings" fill="#82ca9d">
                {topRooms.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={['#4facfe', '#00f2fe', '#2ed8b6', '#59e0c5', '#66d9e8'][index % 5]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
