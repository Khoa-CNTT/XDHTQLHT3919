import React from 'react';

const RoomInfo = ({ room }) => {
  const { name, price, note, detail, pathImg, status, createAt, category } = room;

  const formatPrice = (value) =>
    typeof value === 'number' ? value.toLocaleString() + " VND" : "Đang cập nhật";

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('vi-VN');

  return (
    <div className="room-info">
      <div className="room-image">
        <img src={pathImg || "/default-room.jpg"} alt={name} />
      </div>
      <h1 className="room-title">{name}</h1>
      <div className="room-overview">
        {category && (
          <p><strong>Loại phòng:</strong> {category.name}</p>
        )}
        <p><strong>Giá:</strong> {formatPrice(price)}</p>
        <p><strong>Trạng thái:</strong> {status}</p>
        <p><strong>Ngày tạo:</strong> {formatDate(createAt)}</p>
        {note && (
          <p><strong>Ghi chú:</strong> {note}</p>
        )}
        {detail && (
          <p><strong>Chi tiết:</strong> {detail}</p>
        )}
      </div>
    </div>
  );
};

export default RoomInfo;
