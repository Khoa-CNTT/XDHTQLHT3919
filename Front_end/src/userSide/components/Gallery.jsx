import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Gallery = () => {
    const [galleryImages, setGalleryImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGalleryImages = async () => {
            try {
                const response = await axios.get('axios.get("https://localhost:7145/api/rooms")');
                setGalleryImages(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGalleryImages();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <section className="gallery section-padding">
            <div className="container2">
                <h2 className="section-title">Thư viện ảnh</h2>
                <p className="section-subtitle">Khám phá không gian sang trọng của chúng tôi</p>
                <div className="gallery__grid">
                    {galleryImages.map((image, index) => (
                        <div className="gallery-item" key={index}>
                            <img src={image.src} alt={image.alt} />
                            <div className="gallery-overlay">
                                <i className="fas fa-search-plus"></i>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Gallery;
