import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [name, setUsername] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

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
            setAvatarUrl(avatar);
        }
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
        console.log('Tìm kiếm:', searchQuery);
        // navigate(`/search?q=${searchQuery}`); // nếu bạn có trang tìm kiếm
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    // Dropdown delay (mượt hơn)
    let timeoutId;
    const handleMouseEnter = () => {
        clearTimeout(timeoutId);
        setShowDropdown(true);
    };
    const handleMouseLeave = () => {
        timeoutId = setTimeout(() => setShowDropdown(false), 150);
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
                        <li><Link to="/rooms">Phòng</Link></li>
                        <li><Link to="/services">Tiện nghi</Link></li>
                        <li><Link to="/gallery">Thư viện</Link></li>
                        <li><Link to="/contact">Liên hệ</Link></li>
                        {isAdmin && (
                            <li><Link to="/homemng">Quản lý</Link></li>
                        )}
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
                        <div
                            className="user-menu relative"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className="flex items-center gap-2 cursor-pointer">
                                <img
                                    src={avatarUrl || "https://png.pngtree.com/png-clipart/20210608/ourlarge/pngtree-dark-gray-simple-avatar-png-image_3418404.jpg"}
                                    alt="Avatar"
                                    className="avatar-img"
                                    style={{ width: "35px", height: "35px", borderRadius: "50%" }}
                                />
                                <span className="font-semibold">{name}</span>
                            </div>

                            {showDropdown && (
                                <div className="absolute top-full right-0 bg-white border rounded shadow-md mt-2 w-32 z-10 dropdown">
                                    <button
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                        onClick={() => navigate("/profile")}
                                    >
                                        Hồ sơ
                                    </button>
                                    <button
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                                        onClick={handleLogout}
                                    >
                                        Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
