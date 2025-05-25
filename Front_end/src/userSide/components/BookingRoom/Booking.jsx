import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addBooking } from '../../../services/api/userAPI/bookingAPI';
import { addBookingDetail } from '../../../services/api/userAPI/bookingDetailAPI';
import { fetchRoomDetails } from '../../../services/api/adminAPI/roomAPI';
import Notification from '../../../userSide/components/Other/Notification';
import { checkRoomBooked } from '../../../services/api/adminAPI/roomAPI';
// ...các import khác...

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
  const [showNotification, setShowNotification] = useState(false);  // Trạng thái hiển thị thông báo
  const [notificationMessage, setNotificationMessage] = useState("");  // Nội dung thông báo

  const userId = localStorage.getItem("idUser");

  const formatPrice = (value) =>
    typeof value === 'number' ? value.toLocaleString() + " VND" : "Đang cập nhật";

  // Kiểm tra trạng thái phòng khi component load
  useEffect(() => {
    const checkRoomStatus = async () => {
      try {
        const roomData = await fetchRoomDetails(roomId); // Gọi API lấy chi tiết phòng
        setRoom(roomData);  // Lưu thông tin phòng vào state

        // Kiểm tra nếu phòng không còn trống
        if (roomData.data.status !== 'Còn trống') {
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

// ...existing code...
const handleBooking = async () => {
  if (!userId) {
    setNotificationMessage("Vui lòng đăng nhập trước khi đặt phòng.");
    setShowNotification(true);

    setTimeout(() => {
      navigate("/login");
    }, 6000);
    return;
  }

   try {
    const isBooked = await checkRoomBooked(roomId, checkInDate, checkOutDate);
    if (isBooked) {
      setNotificationMessage("Phòng đã có người đặt trong khoảng thời gian này.");
      setShowNotification(true);
      return;
    }
  } catch (error) {
    setNotificationMessage("Không kiểm tra được trạng thái phòng. Vui lòng thử lại.");
    setShowNotification(true);
    return;
  }

  try {
    // 1. Gọi API tạo đơn Booking
    const bookingPayload = {
      idUser: userId,
      status: 'chờ xác nhận',
      total: totalPrice,
      paymentMethod: 'Đã thanh toán VNPay'
    };

const bookingRes = await addBooking(bookingPayload);
console.log('bookingRes:', bookingRes);
const bookingId = bookingRes.data?.idBooking;
if (!bookingId) {
  setNotificationMessage('Không lấy được mã đặt phòng từ server!');
  setShowNotification(true);
  return;
}
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

    // 3. Tạo bookingData để lưu vào localStorage
    const bookingData = {
      bookingId,
      idUser: userId,
      roomId,
      checkInDate,
      checkOutDate,
      total: totalPrice,
      note,
      bookingDetails: [
        {
          idRoom: roomId,
          checkInDate,
          checkOutDate,
          totalPrice,
          note
        }
      ]
    };

    // Lưu vào localStorage
    localStorage.setItem('bookingData', JSON.stringify(bookingData));

    // 4. Điều hướng sang trang thanh toán
    navigate('/paymentMethod', {
      state: { bookingData }
    });
  } catch (error) {
    console.error('Lỗi khi đặt phòng:', error);
    setNotificationMessage('Đặt phòng thất bại. Vui lòng thử lại.');
    setShowNotification(true);
  }
};
// ...existing code...

  return (
    <div className="booking-box">
      <Notification message={notificationMessage} show={showNotification} onClose={() => setShowNotification(false)} />

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
