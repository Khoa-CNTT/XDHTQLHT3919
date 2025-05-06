import React, { useState, useEffect } from 'react';

// Import các ảnh
import logoBg1 from '../../../images/logo-bg1.jpg';
import logoBg2 from '../../../images/logo-bg2.jpg';
import logoBg3 from '../../../images/logo-bg3.jpg';
import logoBg4 from '../../../images/logo-bg4.jpg';
import logoBg5 from '../../../images/logo-bg5.png';

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Mảng chứa các ảnh đã import
  const images = [logoBg1, logoBg2, logoBg3, logoBg4, logoBg5];

  useEffect(() => {
    const interval = setInterval(() => {
      // Bắt đầu hiệu ứng fade-out
      setIsFadingOut(true);

      // Đợi cho hiệu ứng fade-out hoàn thành rồi thay đổi ảnh
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setIsFadingOut(false); // Sau khi thay đổi ảnh, bắt đầu fade-in
      }, 1000); // Đợi 1s để hoàn thành fade-out trước khi thay đổi ảnh
    }, 5000); // Chuyển ảnh mỗi 5 giây

    return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
  }, []);

  return (
    <section className="hero">
      <div className="hero__background-container">
        <div
          className={`hero__background ${isFadingOut ? 'fade-out' : 'fade-in'}`}
          style={{ backgroundImage: `url(${images[currentIndex]})` }}
        />
      </div>

      <div className="container2">
        <div className="hero__content">
          <h1 className="hero__title">MTX-N54 Homestay</h1>
          <p className="hero__subtitle">Trải nghiệm sang trọng bậc nhất tại trung tâm thành phố</p>
          <div className="hero__buttons">
            <a href="#" className="btn btn--primary1">Đặt phòng ngay</a>
            <a href="#" className="btn btn--outline">Khám phá phòng</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
