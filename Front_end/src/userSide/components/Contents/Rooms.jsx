import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRoomsData } from '../../../services/api/userAPI/room';
import { FaSearch } from 'react-icons/fa';

const Rooms = () => {
  const [roomsData, setRoomsData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getRoomsData = async () => {
      try {
        const response = await fetchRoomsData();
        const rooms = Array.isArray(response) ? response : response.data || [];
        setRoomsData(rooms);
        setOriginalData(rooms);
      } catch (err) {
        setError(err.message || 'Có lỗi xảy ra');
      } finally {
        setLoading(false);
      }
    };
    getRoomsData();
  }, []);

  useEffect(() => {
    const filtered = originalData.filter(room =>
      (room.name || room.title || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
    setRoomsData(filtered);
  }, [searchQuery, originalData]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (showSearch && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showSearch]);

  const handleRoomClick = (room) => {
    navigate(`/room/${room.id}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="rooms section-padding">
      <div className="container2">
        <h2 className="section-title">Phòng nghỉ của chúng tôi</h2>
        <p className="section-subtitle">Các phòng nghỉ sang trọng với đầy đủ tiện nghi</p>

        <div className={`search-container ${showSearch ? 'active' : ''}`} ref={searchRef}>
          <button
            className="btn btn--icon"
            onClick={() => setShowSearch(prev => !prev)}
          >
            <FaSearch />
          </button>

          <input
            ref={inputRef}
            type="text"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

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
