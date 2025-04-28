import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchRoomDetails } from '../../../services/api/userAPI/room';
import RoomInfo from './RoomInfo';
import BookingBox from './Booking';
import { ArrowLeft } from 'lucide-react';
import "../../../assets/Style/home-css/roomDetail.css";

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const getRoom = async () => {
      try {
        const res = await fetchRoomDetails(id);
        setRoom(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết phòng:", error);
      } finally {
        setLoading(false);
      }
    };
    getRoom();
  }, [id]);

  useEffect(() => {
    if (checkInDate && checkOutDate && room) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const diffTime = checkOut - checkIn;
      const daysStayed = diffTime / (1000 * 3600 * 24);
      if (daysStayed > 0) {
        const roomPrice = room.price || 0;
        const cleaningFee = 50000;
        const serviceFee = 30000;
        const total = (roomPrice * daysStayed) + cleaningFee + serviceFee;
        setTotalPrice(total);
      } else {
        setTotalPrice(0);
      }
    }
  }, [checkInDate, checkOutDate, room]);
  const [note, setNote] = useState('');

  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };


  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (!room) return <div>Không tìm thấy phòng!</div>;

  return (
    <div className="room-detail-container">
      <button onClick={() => navigate(-1)} className="back-btn">
        <ArrowLeft /> Quay lại
      </button>

      <div className="room-content">
        <RoomInfo room={room} />

        <BookingBox
          id={id}
          price={room.price}
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          totalPrice={totalPrice}
          handleCheckInChange={(e) => setCheckInDate(e.target.value)}
          handleCheckOutChange={(e) => setCheckOutDate(e.target.value)}
          note={note}
          handleNoteChange={handleNoteChange}
        />
      </div>
    </div>
  );
};

export default RoomDetail;
