import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate(); 

    const handleLogin = (user) => {
        setIsLoggedIn(true);
        setUsername(user.username);
        setIsAdmin(user.isAdmin);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUsername('');
        setIsAdmin(false);
        localStorage.removeItem("token"); // Xóa token khi đăng xuất
    };

    const goToAdminDashboard = () => {
        navigate('/admin');
    };

    const goToLoginPage = () => {
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="container1">
                <div className="header__logo">
                    <h1>HynhQwc Homestay</h1>
                </div>
                <nav className="header__nav">
                    <ul>
                        <li><a href="#">Trang chủ</a></li>
                        <li><a href="#">Phòng</a></li>
                        <li><a href="#">Tiện nghi</a></li>
                        <li><a href="#">Thư viện</a></li>
                        <li><a href="#">Liên hệ</a></li>
                        {isAdmin && (
                            <li>
                                <button onClick={goToAdminDashboard} className="btn btn--secondary">Quản lý</button>
                            </li>
                        )}
                    </ul>
                </nav>
                <div className="header__actions">
                    <button className="btn btn--primary">Đặt phòng</button>
                    {isLoggedIn ? (
                        <div className="user-menu">
                            <button className="btn btn--secondary">{username}</button>
                            <div className="dropdown">
                                <button className="btn btn--secondary" onClick={handleLogout}>Đăng xuất</button>
                                <button className="btn btn--secondary">Profile</button>
                            </div>
                        </div>
                    ) : (
                        <button className="btn btn--secondary" onClick={goToLoginPage}>Đăng nhập</button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
