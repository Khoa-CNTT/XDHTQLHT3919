import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import './header.css'; // Đảm bảo bạn đã tạo CSS riêng

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate(); 

    // Kiểm tra xem người dùng có đăng nhập hay không
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setIsLoggedIn(true);
            setUsername(user.username);
            setIsAdmin(user.isAdmin);
        }
    }, []);

    const handleLogin = (user) => {
        setIsLoggedIn(true);
        setUsername(user.username);
        setIsAdmin(user.isAdmin);
        localStorage.setItem('user', JSON.stringify(user)); // Lưu thông tin người dùng vào localStorage
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUsername('');
        setIsAdmin(false);
        localStorage.removeItem('user'); // Xóa thông tin người dùng khỏi localStorage khi đăng xuất
        navigate('/login');
    };

    const goToAdminDashboard = () => {
        navigate('/admin');
    };

    const goToLoginPage = () => {
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="container">
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
                                <button className="btn btn--secondary" onClick={() => navigate('/profile')}>Profile</button>
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
