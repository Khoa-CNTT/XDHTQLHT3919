import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRooms } from '../../../services/api/adminAPI/roomAPI';
import { getAllCategories } from '../../../services/api/adminAPI/roomcategoryAPI';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import '../../../assets/Style/home-css/Room.css';

const Rooms = () => {
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
        console.log('ROOMS:', rooms);
        setRoomsData(rooms);
      } catch (err) {
        setError(err.message || 'Có lỗi xảy ra');
      } finally {
        setLoading(false);
      }
    };

    const getCategories = async () => {
      try {
        const res = await getAllCategories();
        setCategories(res.data || []);
      } catch (err) {
        // Giữ nguyên categories cũ nếu lỗi
      }
    };

    getRoomsData();
    getCategories();
  }, []);

  const formatPrice = (price) =>
    typeof price === 'number' ? price.toLocaleString() + ' VND' : 'Đang cập nhật';

  // Lọc phòng theo giá và danh mục
  const filteredRooms = roomsData.filter((room) => {
  const matchPrice =
    priceFilter === '' ||
    (priceFilter === 'lt500' && room.price < 500000) ||
    (priceFilter === '500to1000' && room.price >= 500000 && room.price <= 1000000) ||
    (priceFilter === 'gt1000' && room.price > 1000000);

  const categoryId = room.category?.id || room.idCategory || room.categoryId || '';
  const matchCategory = categoryFilter === '' || String(categoryId) === String(categoryFilter);

  console.log(`Room: ${room.name}, Price: ${room.price}, CategoryId: ${categoryId}, matchPrice: ${matchPrice}, matchCategory: ${matchCategory}`);

  return matchPrice && matchCategory;
});


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
        <h2 className="section-title">Phòng nghỉ của chúng tôi</h2>
        <p className="section-subtitle">Các phòng nghỉ sang trọng với đầy đủ tiện nghi</p>

        {/* Bộ lọc */}
        <div className="filters" style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <label>
            Lọc theo giá:{' '}
            <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
              <option value="">Tất cả</option>
              <option value="lt500">Dưới 500.000 VND</option>
              <option value="500to1000">500.000 - 1.000.000 VND</option>
              <option value="gt1000">Trên 1.000.000 VND</option>
            </select>
          </label>

          <label>
            Lọc theo loại phòng:{' '}
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="">Tất cả</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>
        </div>

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

export default Rooms;
