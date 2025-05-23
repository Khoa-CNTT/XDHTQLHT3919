import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRooms } from '../../../services/api/adminAPI/roomAPI';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import '../../../assets/Style/home-css/Room.css';

const RoomNew = () => {
  const [roomsData, setRoomsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceFilter, setPriceFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getRoomsData = async () => {
      try {
        const response = await getRooms();
        const rooms = Array.isArray(response) ? response : response.data || [];
        setRoomsData(rooms);

        const uniqueCategories = [
          ...new Set(rooms.map((room) => room.category?.name || room.category || 'Không xác định'))
        ];
        setCategories(uniqueCategories);
      } catch (err) {
        setError(err.message || 'Có lỗi xảy ra');
      } finally {
        setLoading(false);
      }
    };

    getRoomsData();
  }, []);

  const formatPrice = (price) =>
    typeof price === 'number' ? price.toLocaleString() + ' VND' : 'Đang cập nhật';

  // Lọc các phòng thỏa điều kiện
  const filteredRooms = roomsData
  .filter((room) => {
    const matchPrice =
      priceFilter === '' ||
      (priceFilter === 'lt500' && room.price < 500000) ||
      (priceFilter === '500to1000' && room.price >= 500000 && room.price <= 1000000) ||
      (priceFilter === 'gt1000' && room.price > 1000000);

    const roomCategory = room.category?.name || room.category || 'Không xác định';

    const matchCategory =
      categoryFilter === '' || roomCategory.toLowerCase() === categoryFilter.toLowerCase();

    return matchPrice && matchCategory;
  })
  .sort((a, b) => new Date(b.createAt) - new Date(a.createAt)) // Sắp xếp giảm dần theo ngày tạo
  .slice(0, 9);


  const handleRoomClick = (room) => {
    navigate(`/room/${room.id}`);
  };

  const renderSkeletonRooms = (count = 4) => {
    return Array.from({ length: count }).map((_, index) => (
      <div className="room-card" key={index}>
        <div className="room-card__image">
          <Skeleton height={180} />
        </div>
        <div className="room-card__content">
          <h3><Skeleton width={200} /></h3>
          <h3><Skeleton width={250} /></h3>
          <h3><Skeleton width={150} /></h3>
          <p className="room-price"><Skeleton width={100} /></p>
          <Skeleton width={100} height={36} />
        </div>
      </div>
    ));
  };

  return (
    <section className="rooms section-padding">
      <div className="container2">
        <h2 className="section-title">Phòng mới nhất của chung tôi</h2>
        <p className="section-subtitle">Những phòng mới nhất dành cho bạn – không gian sang trọng, trải nghiệm tuyệt vời</p>

        {/* Danh sách phòng */}
        <div className="rooms__grid">
          {loading ? (
            renderSkeletonRooms(6)
          ) : filteredRooms.length === 0 ? (
            <p>Không tìm thấy phòng phù hợp.</p>
          ) : (
            filteredRooms.map((room) => (
              <div className="room-card" key={room.id}>
                <div className="room-card__image">
                  <img src={room.pathImg} alt={room.name} />
                </div>
                <div className="room-card__content">
                  <h3>{room.name}</h3>
                  <h3>{room.detail}</h3>
                  <h3>{room.status}</h3>
                  <h3>Loại phòng: {room.category?.name || room.categoryName || '---'}</h3>
                  <p className="room-price">{formatPrice(room.price)}</p>
                  <button className="btn btn--primary" onClick={() => handleRoomClick(room)}>
                    Chi tiết
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default RoomNew;
