import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import "../../../assets/Style/admin-css/sidebar.css"

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
        <Link to="/roomcategorylist" className={isActive('/roomcategorylist')}>
          <li>Quản lý danh mục</li>
        </Link>
        <Link to="/userlist" className={isActive('/userlist')}>
          <li>Quản lý tài khoản</li>
        </Link>
        <Link to="/customerlist" className={isActive('/customerlist')}>
          <li>Quản lý khách hàng</li>
        </Link>
      </ul>
    </div>
  );
};

export default Sidebar;
