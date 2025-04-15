import React, { useEffect, useState } from 'react';

import { getAmenities } from '../../../services/api/userAPI/Amenities';


const Amenities = () => {
    const [amenities, setAmenities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAmenities = async () => {
            try {
                const data = await getAmenities(); // Gọi API lấy dữ liệu
                setAmenities(data); // Cập nhật state với dữ liệu nhận được
            } catch (err) {
                setError('Không thể tải dữ liệu tiện nghi');
            } finally {
                setLoading(false); // Đảm bảo loading = false khi dữ liệu đã được tải xong
            }
        };

        fetchAmenities();
    }, []); // Chỉ gọi khi component mount

    if (loading) {
        return <div>Đang tải...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <section className="amenities section-padding">
            <div className="container2">
                <h2 className="section-title">Tiện nghi của chúng tôi</h2>
                <p className="section-subtitle">Trải nghiệm những tiện nghi đẳng cấp tại HynhQwc Homestay</p>
                <div className="amenities__grid">
                    {amenities.map((amenity, index) => (
                        <div className="amenity-card" key={index}>
                            <div className="amenity-icon">
                                <i className={amenity.icon}></i>
                            </div>
                            <h3>{amenity.title}</h3>
                            <p>{amenity.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Amenities;
