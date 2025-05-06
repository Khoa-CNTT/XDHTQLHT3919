import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

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
                        <p>Email: info@hynhqwc.com<br />Điện thoại: +84 123 456 789</p>
                    </div>
                    <div className="footer__col">
                        <h3>Liên kết nhanh</h3>
                        <ul>
                            <li><a href="#">Trang chủ</a></li>
                            <li><a href="#">Phòng</a></li>
                            <li><a href="#">Dịch vụ</a></li>
                            <li><a href="#">Ẩm thực</a></li>
                            <li><a href="#">Liên hệ</a></li>
                        </ul>
                    </div>
                    <div className="footer__col">
                        <h3>Dịch vụ</h3>
                        <ul>
                            <li><a href="#">Đặt phòng</a></li>
                            <li><a href="#">Spa & Wellness</a></li>
                            <li><a href="#">Nhà hàng</a></li>
                            <li><a href="#">Sự kiện</a></li>
                            <li><a href="#">Tour du lịch</a></li>
                        </ul>
                    </div>
                    <div className="footer__col">
                        <h3>Kết nối với chúng tôi</h3>
                        <div className="footer__social">
                            <a href="#"><i className="fab fa-facebook-f"></i></a>
                            <a href="#"><i className="fab fa-instagram"></i></a>
                            <a href="#"><i className="fab fa-twitter"></i></a>
                            <a href="#"><i className="fab fa-youtube"></i></a>
                        </div>
                        <div className="footer__newsletter">
                            <h4>Đăng ký nhận tin</h4>
                            <form>
                                <input type="email" placeholder="Email của bạn" required />
                                <button type="submit"><i className="fas fa-paper-plane"></i></button>
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
