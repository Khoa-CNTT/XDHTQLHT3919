import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; 

const RoomDetails = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const roomResponse = await axios.get(`https://example.com/api/rooms/${id}`);
        setRoom(roomResponse.data);

        const imagesResponse = await axios.get(`https://example.com/api/rooms/${id}/images`);
        setImages(imagesResponse.data);
      } catch (err) {
        setError("Lỗi khi tải dữ liệu phòng");
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [id]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Hiển thị trạng thái loading hoặc lỗi
  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      {room && (
        <>
          <h1 className="room-title">{room.name}</h1>
          <div className="room-layout">
            <div className="slider-container">
              <div className="slider">
                <img
                  src={images[currentIndex]}
                  alt={`Room ${currentIndex}`}
                />
              </div>
              <div className="slider-buttons">
                <button onClick={prevSlide}>&larr;</button>
                <button onClick={nextSlide}>&rarr;</button>
              </div>
            </div>

            <div className="room-info">
              <h2>Thông tin phòng</h2>
              <p className="rating">⭐ {room.rating}/5 sao</p>
              <p><strong>Sức chứa:</strong> {room.capacity} người</p>
              <p><strong>Diện tích:</strong> {room.size} m²</p>
              <p><strong>Loại giường:</strong> {room.bed}</p>
              <p><strong>Vị trí:</strong> Tầng {room.floor}</p>
              <p className="description">{room.description}</p>
              <h3>Tiện nghi</h3>
              <ul className="amenities-list">
                {room.amenities.map((amenity, index) => (
                  <li key={index}>✔ {amenity}</li>
                ))}
              </ul>
              <div className="booking-section">
                <h3>Đặt phòng</h3>
                <p className="price">{room.price}</p>
                <button className="book-button">Đặt ngay</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RoomDetails;
