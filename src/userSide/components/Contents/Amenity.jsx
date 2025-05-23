import React, { useEffect, useState } from 'react';
import { getAllAmenities } from '../../../services/api/userAPI/amenityAPI';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import '../../../assets/Style/home-css/Amenity.css';

import {
    FaWifi, FaSnowflake, FaTv, FaUtensils,
    FaSwimmingPool, FaBath, FaBed, FaFan
} from 'react-icons/fa';
import { MdPets } from 'react-icons/md';
import { GiBarbecue } from 'react-icons/gi';

const getAmenityIcon = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes("wifi")) return <FaWifi />;
    if (lower.includes("điều hòa") || lower.includes("máy lạnh")) return <FaSnowflake />;
    if (lower.includes("tivi") || lower.includes("tv")) return <FaTv />;
    if (lower.includes("bếp") || lower.includes("nấu ăn")) return <FaUtensils />;
    if (lower.includes("hồ bơi")) return <FaSwimmingPool />;
    if (lower.includes("bồn tắm")) return <FaBath />;
    if (lower.includes("giường")) return <FaBed />;
    if (lower.includes("quạt")) return <FaFan />;
    if (lower.includes("thú cưng")) return <MdPets />;
    if (lower.includes("nướng") || lower.includes("bbq")) return <GiBarbecue />;
    return <FaBed />;
};

const Amenity = () => {
    const [amenities, setAmenities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAmenities = async () => {
            try {
                const response = await getAllAmenities();
                setAmenities(response.data.slice(0, 4));
            } catch (err) {
                console.error('Lỗi khi tải tiện nghi:', err);
                setError('Không thể tải dữ liệu tiện nghi');
            } finally {
                setLoading(false);
            }
        };

        fetchAmenities();
    }, []);

    const renderSkeletonAmenities = (count = 4) => {
        return Array.from({ length: count }).map((_, index) => (
            <div className="amenity-card" key={index}>
                <div className="amenity-icon">
                    <Skeleton circle height={40} width={40} />
                </div>
                <h3><Skeleton width={120} /></h3>
            </div>
        ));
    };

    return (
        <section className="amenities section-padding">
            <div className="container2">
                <h2 className="section-title">Tiện nghi nổi bật</h2>
                <p className="section-subtitle">Các tiện nghi phổ biến nhất tại Homestay MTX-N54 của chung tôi</p>
                <div className="amenities__grid">
                    {loading ? (
                        renderSkeletonAmenities()
                    ) : error ? (
                        <p>{error}</p>
                    ) : amenities.length > 0 ? (
                        amenities.map((amenity, index) => (
                            <div className="amenity-card" key={index}>
                                <div className="amenity-icon">
                                    {getAmenityIcon(amenity.name)}
                                </div>
                                <h3>{amenity.name}</h3>
                            </div>
                        ))
                    ) : (
                        <p>Không có tiện nghi nào được tìm thấy.</p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Amenity;
