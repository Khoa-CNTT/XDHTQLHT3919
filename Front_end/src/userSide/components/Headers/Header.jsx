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
    const [role, setRole] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    const isMobile = useIsMobile();
    const navigate = useNavigate();
    const searchRef = useRef(null);

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

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowSearch(false); // Ẩn input nếu click ra ngoài
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

    const handleSearch = () => {
        console.log("Tìm kiếm:", searchQuery);
    };


    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
            setShowSearch(false); // ẩn lại input sau khi tìm kiếm nếu muốn
        }
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const renderMenuItems = () => (
        <ul className="header__menu">
            <li><Link to="/home">Trang chủ</Link></li>
            <li><a href="#">Phòng</a></li>
            <li><a href="#">Tiện nghi</a></li>
            <li><a href="#">Thư viện</a></li>
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
                    <button className="btn btn--secondary" onClick={() => navigate("/profile")}>Profile</button>
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
                            <button
                                className="btn btn--icon"
                                onClick={() => setShowSearch(true)} 
                            >
                                <FaSearch />
                            </button>
                        ) : (
                            <input
                                type="text"
                                placeholder="Tìm kiếm..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSearch();
                                        setShowSearch(false);
                                    }
                                }}
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
                            <div className="user-menu">
                                <div className="user-avatar">
                                    <img
                                        src={avatarUrl || "/images/avatar.jpg"}
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
