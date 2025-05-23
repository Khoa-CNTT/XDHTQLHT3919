import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaPaperPlane } from 'react-icons/fa';

const Footer = () => {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://app.preny.ai/embed-global.js";
        script.async = true;
        script.defer = true;
        script.setAttribute("data-button-style", "width:200px;height:200px");
        script.setAttribute("data-preny-bot-id", "68183e57a705cfd56ee4b0a7");
        document.body.appendChild(script);

        // Cleanup script when component unmounts (optional)
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <footer className="footer">
            <div className="container2">
                <div className="footer__grid">
                    <div className="footer__col">
                        <h3>HynhQwc Homestay</h3>
                        <p>32 Trần Xuân Soạn<br />Thành phố Đà Nẵng, Việt Nam</p>
                        <p>Email: hlaquoc@gmail.com<br />Điện thoại: +84 702 309 446</p>
                    </div>
                    <div className="footer__col">
                        <h3>Liên kết nhanh</h3>
                        <ul>
                            <li><Link to="/">Trang chủ</Link></li>
                            <li><Link to="/room">Phòng</Link></li>
                            <li><Link to="/service">Dịch vụ</Link></li>
                            <li><Link to="/">Ẩm thực</Link></li>
                            <li><Link to="/contact">Liên hệ</Link></li>

                        </ul>
                    </div>
                    <div className="footer__col">
                        <h3>Dịch vụ</h3>
                        <ul>
                            <li><Link to="/">Trang chủ</Link></li>
                            <li><Link to="/spa">Spa & Wellness</Link></li>
                            <li><Link to="/restaurant">Nhà hàng</Link></li>
                            <li><Link to="/events">Sự kiện</Link></li>
                            <li><Link to="/tours">Tour du lịch</Link></li>
                        </ul>

                    </div>
                    <div className="footer__col">
                        <h3>Kết nối với chúng tôi</h3>
                        <div className="footer__social">
                            <a href="https://www.facebook.com/profile.php?id=100027204825889" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
                            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                            <a href="https://www.youtube.com/results?search_query=homstay" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
                        </div>
                        <div className="footer__newsletter">
                            <h4>Đăng ký nhận tin</h4>
                            <form>
                                <input type="email" placeholder="Email của bạn" required />
                                <button type="submit"><FaPaperPlane /></button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="footer__bottom">
                    <p>&copy; 2023 HynhQwc Homestay. All rights reserved.</p>
                    <div className="footer__links">
                        <Link to="/privacypolicy">Chính sách bảo mật</Link>
                        <Link to="/termsOfservice">Điều khoản sử dụng</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
