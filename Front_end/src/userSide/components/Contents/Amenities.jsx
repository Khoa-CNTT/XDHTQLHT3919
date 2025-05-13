import React, { useEffect, useState } from 'react';
import { getAllAmenities } from '../../../services/api/userAPI/amenityAPI';
import '../../../assets/Style/home-css/Amenity.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import { FaWifi, FaSnowflake, FaTv, FaUtensils, FaSwimmingPool, FaBath, FaBed, FaFan } from 'react-icons/fa';
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

const Amenities = () => {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const response = await getAllAmenities();
        setAmenities(response.data);
      } catch (err) {
        console.error('Lỗi khi tải tiện nghi:', err);
        setError('Không thể tải dữ liệu tiện nghi');
      } finally {
        setLoading(false);
      }
    };

    fetchAmenities();
  }, []);

  const renderSkeletonAmenities = (count = 6) => {
    return Array.from({ length: count }).map((_, index) => (
      <div className="amenity-card" key={index}>
        <div className="amenity-icon">
          <Skeleton circle width={40} height={40} />
        </div>
        <h3><Skeleton width={100} /></h3>
      </div>
    ));
  };

  return (
    <section className="amenities section-padding">
      <div className="container2">
        <h2 className="section-title">Tiện nghi của chúng tôi</h2>
        <p className="section-subtitle">Trải nghiệm những tiện nghi đẳng cấp tại MTX-N54</p>
        <div className="amenities__grid">
          {loading ? (
            renderSkeletonAmenities(8)
          ) : error ? (
            <p>{error}</p>
          ) : amenities && amenities.length > 0 ? (
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

export default Amenities;
