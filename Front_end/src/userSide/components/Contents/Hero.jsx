import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Import ảnh nền
import logoBg1 from '../../../images/logo-bg1.jpg';
import logoBg2 from '../../../images/logo-bg2.jpg';
import logoBg3 from '../../../images/logo-bg3.jpg';
import logoBg4 from '../../../images/logo-bg4.jpg';
import logoBg5 from '../../../images/logo-bg5.png';

import '../../../assets/Style/home-css/hero.css';

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [logoBg1, logoBg2, logoBg3, logoBg4, logoBg5];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero">
      <div className="hero__background-container">
        {images.map((image, index) => (
          <div
            key={index}
            className={`hero__background ${index === currentIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
      </div>

      <div className="container2">
        <div className="hero__content">
          <h1 className="hero__title">MTX-N54 Homestay</h1>
          <p className="hero__subtitle">Trải nghiệm sang trọng bậc nhất tại trung tâm thành phố</p>
          <div className="hero__buttons">
            <Link to="/room" className="btn--primary1">Đặt phòng ngay</Link>
            <Link to="/room" className="btn--outline">Khám phá phòng</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;