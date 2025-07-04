import React from 'react';


const RoomInfo = ({ room }) => {
  const { name, price, note, detail, pathImg, status, createAt, category, amenities } = room;

  const formatPrice = (value) =>
    typeof value === 'number' ? value.toLocaleString() + " VND" : "Đang cập nhật";

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('vi-VN');

  return (
    <div className="room-info">
      <div className="room-image">
        <img
  src={
    room.pathImg
      ? room.pathImg.startsWith('http')
        ? room.pathImg
        : `https://localhost:7154${room.pathImg}`
      : '/default-room.jpg'
  }
  alt={room.name}
/>
      </div>
      <h1 className="room-title">{name}</h1>
      <div className="room-overview">
        <p><strong>Loại phòng:</strong> {category || room.categoryName || '---'}</p>
        <p><strong>Giá:</strong> {formatPrice(price)}</p>
        <p><strong>Trạng thái:</strong> {status}</p>
        <p><strong>Ngày tạo:</strong> {formatDate(createAt)}</p>
        {note && (
          <p><strong>Ghi chú:</strong> {note}</p>
        )}
        {detail && (
          <p><strong>Chi tiết:</strong> {detail}</p>
        )}
        <p><strong>Giờ Checkin - Checkout:</strong> 14h - 12h</p>


        {/* Hiển thị tiện nghi */}
        {Array.isArray(amenities) && amenities.length > 0 && (
          <div className="room-amenities">
            <strong>Tiện nghi:</strong>
            <div className="room-amenities-list">
              {amenities.map((amenity) => (
                <div key={amenity.id} className="room-amenity">
                  {amenity.name}
                </div>
              ))}
            </div>
          </div>
        )}



      </div>
    </div>
  );
};

export default RoomInfo;
