import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="sidebar">
      <h2>Admin</h2>
      <ul>
        <Link to="/dashboard" className={isActive('/dashboard')}>
          <li>Thống kê</li>
        </Link>
        <Link to="/productlist" className={isActive('/productlist')}>
          <li>Quản lý phòng</li>
        </Link>
        <Link to="/dashboard" className={isActive('/dashboard')}>
          <li>Quản lý danh mục</li>
        </Link>
        <Link to="/users" className={isActive('/users')}>
          <li>Quản lý tài khoản</li>
        </Link>
      </ul>
    </div>
  );
};

export default Sidebar;