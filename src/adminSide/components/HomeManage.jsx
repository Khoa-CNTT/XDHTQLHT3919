import React from 'react';
import { FaHome, FaUsers, FaCogs, FaBed, FaUserTie } from 'react-icons/fa';
import "../../assets/Style/manage.css";

const AdminDashboard = () => {
    const handleBackToHome = () => {
        window.location.href = '/'; // Chuyển hướng về trang chủ
    };

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <div className="logo">
                    <h2>Admin Panel</h2>
                </div>
                <nav className="menu">
                    <ul>
                        <li>
                            <button onClick={handleBackToHome}>
                                <FaHome /> Trang chủ
                            </button>
                        </li>
                        <li>
                            <button>
                                <FaUsers /> Quản lý Khách hàng
                            </button>
                        </li>
                        <li>
                            <button>
                                <FaUserTie /> Quản lý Nhân viên
                            </button>
                        </li>
                        <li>
                            <button>
                                <FaCogs /> Danh mục Phòng
                            </button>
                        </li>
                        <li>
                            <button>
                                <FaBed /> Quản lý Phòng
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Phần Nội Dung Chính */}
            <main className="dashboard-main">
                <header className="dashboard-header">
                    <button className="back-home-btn" onClick={handleBackToHome}>
                        <FaHome /> Quay lại trang chủ
                    </button>
                </header>

                <section className="dashboard-content">
                    <h1>Quản lý hệ thống</h1>
                    <div className="stat-box">
                        <h3>Tổng số khách hàng</h3>
                        <p>200</p>
                    </div>
                    <div className="stat-box">
                        <h3>Tổng số nhân viên</h3>
                        <p>50</p>
                    </div>
                    <div className="stat-box">
                        <h3>Tổng số phòng</h3>
                        <p>30</p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AdminDashboard;
