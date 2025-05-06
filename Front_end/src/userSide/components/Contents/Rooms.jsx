import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRoomsData } from '../../../services/api/userAPI/room';
import { motion } from 'framer-motion';
import '../../../assets/Style/home-css/Room.css';

const Rooms = () => {
  const [roomsData, setRoomsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getRoomsData = async () => {
      try {
        const response = await fetchRoomsData();
        const rooms = Array.isArray(response)
          ? response
          : response.data || [];
        setRoomsData(rooms);
      } catch (err) {
        setError(err.message || 'Có lỗi xảy ra');
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
        <h2 className="section-title">Phòng nghỉ sang trọng</h2>
        <p className="section-subtitle">Không gian tinh tế và đẳng cấp</p>
        <div className="rooms__grid">
          {roomsData.map((room, index) => (
            <motion.div
              key={room.id}
              className="room-card"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => handleRoomClick(room)}
            >
              <div className="room-card__image">
                <img src={room.image || room.pathImg} alt={room.title || room.name} />
              </div>
              <div className="room-card__content">
                <h3>{room.title || room.name}</h3>
                <p className="room-price">{room.price} VND</p>
                <button className="btn btn--primary-room">Chi tiết</button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Rooms;
