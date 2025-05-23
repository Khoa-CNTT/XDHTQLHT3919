import React, { useEffect, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';

import {
  getMonthlyRevenue,
  getTopBookedRooms
} from '../../../services/api/adminAPI/dashboardAPI';

import "../../../assets/Style/admin-css/dashboard.css";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [years, setYears] = useState([]);
  const [topRooms, setTopRooms] = useState([]);
  const [showTopRooms, setShowTopRooms] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const revenueData = await getMonthlyRevenue();
      setData(revenueData);

      const yearList = [...new Set(revenueData.map(item => item.year))];
      setYears(yearList.sort((a, b) => b - a));

      const roomData = await getTopBookedRooms();
      setTopRooms(roomData);
    };

    fetchData();
  }, []);

  const filteredData = data.filter(item => item.year === selectedYear);

  return (
    <div className="dashboard-container">
      {/* Nút chuyển đổi */}
      <div className="chart-box">
        <button
          onClick={() => setShowTopRooms(!showTopRooms)}
          className="toggle-button"
        >
          {showTopRooms ? "Xem thống kê doanh thu" : "Xem Top 5 phòng"}
        </button>
      </div>

      {/* Hiện biểu đồ doanh thu hoặc top phòng tùy theo trạng thái */}
      {!showTopRooms ? (
        <div className="chart-box">
          <h2>Thống kê doanh thu theo tháng</h2>
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
