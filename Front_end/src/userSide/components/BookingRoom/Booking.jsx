import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addBooking } from '../../../services/api/userAPI/bookingAPI'; 
import { addBookingDetail } from '../../../services/api/userAPI/bookingDetail';
import { fetchRoomDetails } from '../../../services/api/userAPI/room';  // Import đúng API

const Booking = ({
  price,
  id: roomId,
  checkInDate,
  checkOutDate,
  totalPrice,
  handleCheckInChange,
  handleCheckOutChange,
  note,
  handleNoteChange
}) => {
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);  // State để lưu thông tin phòng
  const [isRoomAvailable, setIsRoomAvailable] = useState(true); // Biến kiểm tra trạng thái phòng

  // ✅ Lấy userId từ localStorage
  const userId = localStorage.getItem("userId");

  const formatPrice = (value) =>
    typeof value === 'number' ? value.toLocaleString() + " VND" : "Đang cập nhật";

  // Kiểm tra trạng thái phòng khi component load
  useEffect(() => {
    const checkRoomStatus = async () => {
      try {
        const roomData = await fetchRoomDetails(roomId); // Gọi API lấy chi tiết phòng
        setRoom(roomData);  // Lưu thông tin phòng vào state

        // Kiểm tra nếu phòng không còn trống
        if (roomData.data.status !== 'trống') {
          setIsRoomAvailable(false);  // Phòng không còn trống, set isRoomAvailable = false
        } else {
          setIsRoomAvailable(true);  // Phòng còn trống
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin phòng:', error);
        alert('Không thể lấy thông tin phòng.');
      }
    };

    checkRoomStatus();  // Gọi hàm kiểm tra khi component load
  }, [roomId]);

  const handleBooking = async () => {
    if (!userId) {
      alert("Vui lòng đăng nhập trước khi đặt phòng.");
      navigate("/login");
      return;
    }

    if (!isRoomAvailable) {
      alert("Phòng này đã được đặt hoặc không còn trống.");
      return;
    }

    try {
      // 1. Gọi API tạo đơn Booking
      const bookingPayload = {
        idUser: userId,
        status: 'chờ xác nhận',
        total: totalPrice,
        paymentMethod: 'chưa chọn'
      };

      const bookingRes = await addBooking(bookingPayload);
      const bookingId = bookingRes.id; // hoặc bookingRes.data.id tuỳ theo backend

      // 2. Gọi API tạo chi tiết BookingDetail
      const detailPayload = {
        idBooking: bookingId,
        idRoom: roomId,
        checkInDate,
        checkOutDate,
        totalPrice,
        note
      };

      await addBookingDetail(detailPayload);

      // 3. Điều hướng sang trang thanh toán
      navigate('/paymentMethod', {
        state: {
          roomId,
          checkInDate,
          checkOutDate,
          totalPrice,
          note,
          bookingId
        }
      });
    } catch (error) {
console.error('Lỗi khi đặt phòng:', error);
      alert('Đặt phòng thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <div className="booking-box">
      <div className="price">{formatPrice(price)} / đêm</div>

      <div className="date-selection">
        <div>
          <label>Ngày Check-in:</label>
          <input
            type="date"
            value={checkInDate}
            onChange={handleCheckInChange}
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
        <div>
          <label>Ngày Check-out:</label>
          <input
            type="date"
            value={checkOutDate}
            onChange={handleCheckOutChange}
            min={checkInDate}
          />
        </div>
        <div>
          <label>Ghi chú thêm:</label>
          <textarea
            value={note}
            onChange={handleNoteChange}
            placeholder="Nhập yêu cầu đặc biệt của bạn..."
            rows="3"
            className="note-textarea"
          ></textarea>
        </div>
      </div>

      <div className="booking-summary">
        <div><span>Phí vệ sinh</span><span>50,000 VND</span></div>
        <div><span>Phí dịch vụ</span><span>30,000 VND</span></div>
        <div className="total">
          <span>Tổng</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
      </div>

      <button
        className="book-now-btn"
        onClick={handleBooking}
        disabled={!checkInDate || !checkOutDate || totalPrice === 0 || !isRoomAvailable}
      >
        {isRoomAvailable ? 'Đặt ngay' : 'Phòng không còn trống'}
      </button>
    </div>
  );
};

export default Booking;