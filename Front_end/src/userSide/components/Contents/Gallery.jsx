import React, { useState, useEffect } from 'react';
import { getGalleryImages } from '../../../services/api/userAPI/gallery';
import "../../../assets/Style/home-css/gallery.css";

const Gallery = () => {
    const [galleryImages, setGalleryImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

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

    const prevImage = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? galleryImages.length - 1 : prev - 1
        );
    };

    const nextImage = () => {
        setCurrentIndex((prev) =>
            (prev + 1) % galleryImages.length
        );
    };

    // Lấy ảnh theo vị trí (vòng lặp)
    const getImageAt = (index) => {
        const length = galleryImages.length;
        return galleryImages[(index + length) % length];
    };

    return (
        <section className="gallery section-padding">
            <h2 className="section-title">Thư viện ảnh</h2>
            <p className="section-subtitle">Khám phá không gian sang trọng của chúng tôi</p>

            <div className="carousel">
    {/* Thêm container cho các nút điều hướng */}
    <div className="nav-btn-container">
        <button className="nav-btn" onClick={prevImage}>←</button>
        <button className="nav-btn" onClick={nextImage}>→</button>
    </div>

    <div className="carousel-images">
        <img
            src={getImageAt(currentIndex - 1)?.src}
            alt=""
            className="side-image left"
        />
        <img
            src={getImageAt(currentIndex)?.src}
            alt=""
            className="main-image"
        />
        <img
            src={getImageAt(currentIndex + 1)?.src}
            alt=""
            className="side-image right"
        />
    </div>
</div>

        </section>
    );
};

export default Gallery;