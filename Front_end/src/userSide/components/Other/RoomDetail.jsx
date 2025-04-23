import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchRoomDetails } from '../../../services/api/userAPI/room';
import "../../../assets/Style/home-css/roomDetail.css";
import { ArrowLeft } from 'lucide-react';

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRoom = async () => {
      try {
        const res = await fetchRoomDetails(id);
        setRoom(res.data); // ✅ sửa ở đây
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết phòng:", error);
      } finally {
        setLoading(false);
      }
    };

    getRoom();
  }, [id]);

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (!room) return <div>Không tìm thấy phòng!</div>;

  const { name, price, note, detail, pathImg, status, createAt, category } = room;

  const formatPrice = (value) =>
    typeof value === 'number' ? value.toLocaleString() + " VND" : "Đang cập nhật";

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('vi-VN');

  return (
    <div className="room-detail-container">
      <button onClick={() => navigate(-1)} className="back-btn">
        <ArrowLeft /> Quay lại
      </button>

      <div className="room-content">
        <div className="room-info">
          <h1 className="room-title">{name}</h1>
          <div className="room-image">
            <img src={pathImg || "/default-room.jpg"} alt={name} />
          </div>
          <div className="room-overview">
            <p><strong>Giá:</strong> {formatPrice(price)}</p>
            <p><strong>Ghi chú:</strong> {note}</p>
            <p><strong>Chi tiết:</strong> {detail}</p>
            <p><strong>Trạng thái:</strong> {status}</p>
            <p><strong>Ngày tạo:</strong> {formatDate(createAt)}</p>
            {category && <p><strong>Loại phòng:</strong> {category.name}</p>}
          </div>
        </div>

        <div className="booking-box">
          <div className="price">{formatPrice(price)} / đêm</div>
          <div className="booking-summary">
            <div><span>Phí vệ sinh</span><span>50,000 VND</span></div>
            <div><span>Phí dịch vụ</span><span>30,000 VND</span></div>
            <div className="total">
              <span>Tổng</span>
              <span>{typeof price === 'number' ? (price + 80000).toLocaleString() + " VND" : "Đang cập nhật"}</span>
            </div>
          </div>
          <button className="book-now-btn">Đặt ngay</button>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
