import React from 'react';

const amenitiesData = [
    { icon: "fas fa-swimming-pool", title: "Hồ bơi vô cực", description: "Hồ bơi ngoài trời với view toàn cảnh thành phố" },
    { icon: "fas fa-spa", title: "Spa & Wellness", description: "Dịch vụ spa cao cấp và phòng xông hơi" },
    { icon: "fas fa-utensils", title: "Nhà hàng", description: "Ẩm thực đa dạng từ các đầu bếp hàng đầu" },
    { icon: "fas fa-wifi", title: "Wifi tốc độ cao", description: "Kết nối internet không dây miễn phí" },
    { icon: "fas fa-dumbbell", title: "Phòng gym", description: "Trang thiết bị tập luyện hiện đại" },
    { icon: "fas fa-parking", title: "Bãi đỗ xe", description: "Bãi đỗ xe rộng rãi và an ninh" }
];

const Amenities = () => {
    return (
        <section className="amenities section-padding">
            <div className="container2">
                <h2 className="section-title">Tiện nghi của chúng tôi</h2>
                <p className="section-subtitle">Trải nghiệm những tiện nghi đẳng cấp tại HynhQwc Homestay</p>
                <div className="amenities__grid">
                    {amenitiesData.map((amenity, index) => (
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