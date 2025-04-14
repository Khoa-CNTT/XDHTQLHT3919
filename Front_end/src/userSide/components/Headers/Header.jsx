import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [name, setUsername] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [role, setRole] = useState(''); // <-- Thêm state role

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("username");
        const userRole = localStorage.getItem("role");
        const avatar = localStorage.getItem("avatarUrl") || "";

        if (token && user) {
            setIsLoggedIn(true);
            setUsername(user);
            setRole(userRole);
            setIsAdmin(userRole === "admin");
            setAvatarUrl(avatar);
        }
    }, []);

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUsername('');
        setIsAdmin(false);
        setAvatarUrl('');
        setRole('');
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("role");
        localStorage.removeItem("avatarUrl");
        navigate('/login');
    };

    const handleSearch = () => {
        console.log('Tìm kiếm:', searchQuery);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <header className="header">
            <div className="container1">
                <div className="header__logo">
                    <img src="/logo.png" alt="Logo" />
                </div>

                <nav className="header__nav">
                    <ul>
                        <li><Link to="/home">Trang chủ</Link></li>
                        <li><a href="#">Phòng</a></li>
                        <li><a href="#">Tiện nghi</a></li>
                        <li><a href="#">Thư viện</a></li>
                        <li><Link to="/contact">Liên hệ</Link></li>
                        <li>
                            <Link to="/adminlayout">Quản lý</Link>
                        </li>
                    </ul>
                </nav>

                <div className="header__actions">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <button className="btn btn--secondary" onClick={handleSearch}>
                            <FaSearch />
                        </button>
                    </div>

                    {!isLoggedIn ? (
                        <>
                            <button className="btn btn--primary" onClick={() => navigate("/register")}>Đăng ký</button>
                            <button className="btn btn--primary" onClick={() => navigate("/login")}>Đăng nhập</button>
                        </>
                    ) : (
                        <div className="user-menu">
                            <div className="user-avatar">
                                <img 
                                    src={avatarUrl || "/images/avatar.jpg"} 
                                    alt="Avatar" 
                                    className="avatar-img" 
                                />
                                <span className="font-semibold">{name}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
