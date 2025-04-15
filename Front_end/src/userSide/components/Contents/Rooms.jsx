// src/Rooms.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Sử dụng useNavigate thay vì useHistory
import { fetchRoomsData } from '../../../services/api/userAPI/Room';


const Rooms = ({ onRoomClick }) => {
  const [roomsData, setRoomsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();  // Sử dụng useNavigate để điều hướng

  useEffect(() => {
    const getRoomsData = async () => {
      try {
        const data = await fetchRoomsData();
        setRoomsData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getRoomsData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleRoomClick = (room) => {
    navigate(`/room/${room.id}`);
  };

  return (
    <section className="rooms section-padding">
      <div className="container2">
        <h2 className="section-title">Phòng nghỉ của chúng tôi</h2>
        <p className="section-subtitle">Các phòng nghỉ sang trọng với đầy đủ tiện nghi</p>
        <div className="rooms__grid">
          {roomsData.map((room) => (
            <div className="room-card" key={room.id}>
              <div className="room-card__image">
                <img src={room.image} alt={room.title} />
              </div>
              <div className="room-card__content">
                <h3>{room.title}</h3>
                <p className="room-price">{room.price}</p>
                <button
                  className="btn btn--primary"
                  onClick={() => handleRoomClick(room)}
                >
                  Chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Rooms;
