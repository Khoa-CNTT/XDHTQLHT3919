import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchRoomsData } from '../../../services/api/userAPI/room';

const Rooms = ({ onRoomClick }) => {
  const [roomsData, setRoomsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getRoomsData = async () => {
      try {
        const response = await fetchRoomsData();

        // Kiểm tra nếu response có dạng { data: [...] }
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
        <h2 className="section-title">Phòng nghỉ của chúng tôi</h2>
        <p className="section-subtitle">Các phòng nghỉ sang trọng với đầy đủ tiện nghi</p>
        <div className="rooms__grid">
          {roomsData.map((room) => (
            <div className="room-card" key={room.id}>
              <div className="room-card__image">
                <img src={room.image || room.pathImg} alt={room.title || room.name} />
              </div>
              <div className="room-card__content">
                <h3>{room.title || room.name}</h3>
                <p className="room-price">{room.price} VND</p>
                <button
                  className="btn btn--primary"
                  onClick={() => handleRoomClick(room)}
                >
                  Chi tiết
                {/* <Link to="/detail">Chi tiet</Link> */}
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