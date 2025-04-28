import React from 'react';
import { Link } from 'react-router-dom';

const BookingBox = ({ 
  price, 
  id, 
  checkInDate, 
  checkOutDate, 
  totalPrice, 
  handleCheckInChange, 
  handleCheckOutChange,
  note,
  handleNoteChange
}) => {
  const formatPrice = (value) =>
    typeof value === 'number' ? value.toLocaleString() + " VND" : "Đang cập nhật";

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

      <Link 
        to={{
          pathname: '/paymentMethod',  
          state: {
            roomId: id,
            checkInDate,
            checkOutDate,
            totalPrice,
            note // gửi luôn ghi chú qua trang booking
          }
        }} 
        className="book-now-btn" 
        disabled={!checkInDate || !checkOutDate || totalPrice === 0}
      >
        Đặt ngay
      </Link>
    </div>
  );
};

export default BookingBox;
