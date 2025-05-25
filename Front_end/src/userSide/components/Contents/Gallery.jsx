import React, { useState, useEffect } from 'react';
import { getGalleryImages } from '../../../services/api/userAPI/galleryAPI';
import "../../../assets/Style/home-css/gallery.css";
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

const Gallery = () => {
    const [galleryImages, setGalleryImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState(false);

    useEffect(() => {
        const fetchGalleryImages = async () => {
            try {
                const data = await getGalleryImages();
                setGalleryImages(data);
            } catch (err) {
                console.error('Lỗi tải ảnh:', err);
            }
        };

        fetchGalleryImages();
    }, []);

    const handleImageChange = (direction) => {
        setFade(true); // bắt đầu hiệu ứng
        setTimeout(() => {
            setCurrentIndex((prev) => {
                if (direction === 'prev') {
                    return prev === 0 ? galleryImages.length - 1 : prev - 1;
                } else {
                    return (prev + 1) % galleryImages.length;
                }
            });
            setFade(false); // kết thúc hiệu ứng
        }, 300); // thời gian trùng với CSS animation
    };

    const getImageAt = (index) => {
        const length = galleryImages.length;
        return galleryImages[(index + length) % length];
    };

    return (
        <section className="gallery section-padding">
            <h2 className="section-title">Thư viện ảnh</h2>
            <p className="section-subtitle">Khám phá không gian sang trọng của chúng tôi</p>

            <div className="carousel-container">
                <div className="carousel">
                    <button className="nav-btn prev" onClick={() => handleImageChange('prev')}>
                        <IoChevronBack size={24} />
                    </button>

                    <div className={`carousel-images ${fade ? 'fade' : ''}`}>
                        <img
  src={
    getImageAt(currentIndex - 1)
      ? getImageAt(currentIndex - 1).src.startsWith('http')
        ? getImageAt(currentIndex - 1).src
        : `https://localhost:7154${getImageAt(currentIndex - 1).src}`
      : ''
  }
  alt=""
  className="side-image left"
/>
<img
  src={
    getImageAt(currentIndex)
      ? getImageAt(currentIndex).src.startsWith('http')
        ? getImageAt(currentIndex).src
        : `https://localhost:7154${getImageAt(currentIndex).src}`
      : ''
  }
  alt=""
  className="main-image"
/>
<img
  src={
    getImageAt(currentIndex + 1)
      ? getImageAt(currentIndex + 1).src.startsWith('http')
        ? getImageAt(currentIndex + 1).src
        : `https://localhost:7154${getImageAt(currentIndex + 1).src}`
      : ''
  }
  alt=""
  className="side-image right"
/>
                    </div>

                    <button className="nav-btn next" onClick={() => handleImageChange('next')}>
                        <IoChevronForward size={24} />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Gallery;
