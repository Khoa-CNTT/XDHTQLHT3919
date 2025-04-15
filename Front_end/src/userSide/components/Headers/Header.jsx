import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaBars } from "react-icons/fa";
import { useIsMobile } from '../../../hooks/useIsMobile';

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    const isMobile = useIsMobile();
    const navigate = useNavigate();
    const searchRef = useRef(null);
    const dropdownRef = useRef(null);

    const getUserInfo = () => {
        return {
            token: localStorage.getItem("token"),
            name: localStorage.getItem("name"),
            role: localStorage.getItem("role"),
            avatar: localStorage.getItem("avatarUrl") || ""
        };
    };

    useEffect(() => {
        const { token, name, role, avatar } = getUserInfo();
        if (token && name) {
            setIsLoggedIn(true);
            setUsername(name);
            setIsAdmin(role === "admin");
            setAvatarUrl(avatar || "/images/avatar.png");
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowSearch(false);
            }
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUsername('');
        setIsAdmin(false);
        setAvatarUrl('');
        localStorage.clear();
        navigate('/login');
    };

    const handleSearch = () => {
        console.log("Tìm kiếm:", searchQuery);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
            setShowSearch(false);
        }
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const renderMenuItems = () => (
        <ul className="header__menu">
            <li><Link to="/home">Trang chủ</Link></li>
            <li><Link to="/rooms">Phòng</Link></li>
            <li><Link to="/services">Tiện nghi</Link></li>
            <li><Link to="/gallery">Thư viện</Link></li>
            <li><Link to="/contact">Liên hệ</Link></li>
            {isAdmin && <li><Link to="/adminlayout">Quản lý</Link></li>}
        </ul>
    );

    const renderMobileDropdown = () => (
        <div className="mobile-dropdown">
            {renderMenuItems()}
            {!isLoggedIn ? (
                <div className="mobile-auth">
                    <button className="btn btn--primary" onClick={() => navigate('/register')}>Đăng ký</button>
                    <button className="btn btn--primary" onClick={() => navigate('/login')}>Đăng nhập</button>
                </div>
            ) : (
                <div className="mobile-user-info">
                    <p className="user-name">Xin chào, {username}</p> {/* Hiển thị tên người dùng */}
                    <button className="btn btn--secondary" onClick={() => navigate("/profile")}>Hồ sơ</button>
                    <button className="btn btn--secondary" onClick={handleLogout}>Đăng xuất</button>
                </div>
            )}
        </div>
    );

    return (
        <header className="header">
            <div className="container1">
                <div className="header__logo">
                    <img src="/logo.png" alt="Logo" />
                </div>

                {!isMobile && (
                    <nav className="header__nav">
                        {renderMenuItems()}
                    </nav>
                )}

                <div className="header__actions">
                    <div className="search-container" ref={searchRef}>
                        {!showSearch ? (
                            <button className="btn btn--icon" onClick={() => setShowSearch(true)}>
                                <FaSearch />
                            </button>
                        ) : (
                            <input
                                type="text"
                                placeholder="Tìm kiếm..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyPress}
                                className="search-input"
                                autoFocus
                            />
                        )}
                    </div>

                    {isMobile ? (
                        <div className="mobile-menu">
                            <button className="btn btn--icon" onClick={toggleMenu}>
                                <FaBars size={20} />
                            </button>
                            {menuOpen && renderMobileDropdown()}
                        </div>
                    ) : (
                        !isLoggedIn ? (
                            <>
                                <button className="btn btn--primary" onClick={() => navigate('/register')}>Đăng ký</button>
                                <button className="btn btn--primary" onClick={() => navigate('/login')}>Đăng nhập</button>
                            </>
                        ) : (
                            <div className="user-menu" ref={dropdownRef}>
                                <div className="user-avatar" onClick={() => setDropdownOpen(!dropdownOpen)} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <img
                                        src={avatarUrl} // Hiển thị avatar người dùng
                                        alt="Avatar"
                                        className="avatar-img"
                                        style={{ width: "35px", height: "35px", borderRadius: "50%" }}
                                    />
                                    <span>{username}</span> {/* Hiển thị tên người dùng */}
                                </div>
                                {dropdownOpen && (
                                    <div className="dropdown">
                                        <button className="btn btn--secondary" onClick={() => navigate("/profile")}>Hồ sơ</button>
                                        <button className="btn btn--secondary" onClick={handleLogout}>Đăng xuất</button>
                                    </div>
                                )}
                            </div>
                        )
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
