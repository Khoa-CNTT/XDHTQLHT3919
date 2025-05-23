import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaBars, FaHeart } from "react-icons/fa";
import { useIsMobile } from '../../../hooks/useIsMobile';
import "../../../images/avatar.jpg";

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [role, setRole] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [showRoomList, setShowRoomList] = useState(false);

    const isMobile = useIsMobile();
    const navigate = useNavigate();
    const searchRef = useRef(null);
    const roomListRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("username");
        const userRole = localStorage.getItem("role");
        const avatar = localStorage.getItem("img") || "/images/avatar.jpg";

        if (token && user) {
            setIsLoggedIn(true);
            setUsername(user);
            setRole(userRole);
            setIsAdmin(userRole === "Admin");
            setAvatarUrl(avatar);
        }
    }, []);

    useEffect(() => {
        const handleUserLoggedIn = () => {
            const user = localStorage.getItem("username");
            const userRole = localStorage.getItem("role");
            const avatar = localStorage.getItem("pathImg") || "";

            setIsLoggedIn(true);
            setUsername(user);
            setRole(userRole);
            setIsAdmin(userRole === "Admin");
            setAvatarUrl(avatar);
        };

        window.addEventListener("userLoggedIn", handleUserLoggedIn);
        return () => window.removeEventListener("userLoggedIn", handleUserLoggedIn);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowSearch(false);
            }
            if (roomListRef.current && !roomListRef.current.contains(e.target)) {
                setShowRoomList(false);
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
        setRole('');
        localStorage.clear();
        navigate('/login');
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const toggleRoomList = () => {
        setShowRoomList(!showRoomList);
    };

    const renderMenuItems = () => (
        <ul className="header__menu">
            <li><Link to="/home">Trang chủ</Link></li>
            <li><Link to="/room">Phòng</Link></li>
            <li><Link to="/amenities">Tiện ích</Link></li>
            <li><Link to="/contact">Liên hệ</Link></li>
            <li><Link to="/adminlayout">Quản lý</Link></li>
            {/* {isAdmin && (
                <li><Link to="/adminlayout">Quản lý</Link></li>
            )} */}

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
                    <button className="btn btn--secondary" onClick={() => navigate("/profile")}>Profile</button>
                    <button className="btn btn--secondary" onClick={() => navigate("/historybooking")}>Lịch sử đặt</button>
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
                            <div className="user-menu">
                                <div className="user-avatar">
                                    <img
                                        src={avatarUrl || "../../../images/avatar.jpg"}
                                        alt="Avatar"
                                        className="avatar-img"
                                    />
                                </div>
                                <div className="user-info">
                                    <span>{username}</span>
                                </div>
                                <div className="dropdown">
                                    <button className="btn btn--secondary" onClick={() => navigate("/profile")}>
                                        Profile
                                    </button>
                                    <button className="btn btn--secondary" onClick={() => navigate("/historybooking")}>
                                        Lịch sử đặt
                                    </button>
                                    <button className="btn btn--secondary" onClick={handleLogout}>
                                        Đăng xuất
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
