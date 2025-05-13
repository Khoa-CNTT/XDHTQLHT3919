import React, { useState, useEffect } from 'react';
// import mockBookingData from '../../../services/api/userAPI/bookingMockData';
import '../../../assets/Style/Others/booking-history.css'


const BookingHistory = () => {
//     const [bookings, setBookings] = useState([]);
  
//     useEffect(() => {
//       // Giả lập việc gọi API và nhận dữ liệu
//       const fetchBookings = async () => {
//         // Thay thế API thực tế bằng mock data
//         setBookings(mockBookingData);
//       };
  
//       fetchBookings();
    // }, []);
  
    return (
      <div className="booking-history-container">
        {/* <h2>Lịch sử Đặt Phòng</h2>
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking.Id} className="booking-item">
              <h3>Mã Đặt Phòng: {booking.Id}</h3>
              <p><strong>Trạng thái:</strong> 
                <span className={`status ${booking.Status.toLowerCase().replace(' ', '-')}`}>
                  {booking.Status}
                </span>
              </p>
              <p><strong>Tổng Tiền:</strong> {new Intl.NumberFormat().format(booking.Total)} đ</p>
              <p><strong>Ngày Đặt:</strong> {new Date(booking.CreateAt).toLocaleDateString()}</p>
              <p><strong>Ngày Check-In:</strong> {new Date(booking.CheckInDate).toLocaleDateString()}</p>
              <p><strong>Ngày Check-Out:</strong> {new Date(booking.CheckOutDate).toLocaleDateString()}</p>
              <h4>Chi Tiết Phòng:</h4>
              <table>
                <thead>
                  <tr>
                    <th>Tên Phòng</th>
                    <th>Số Lượng</th>
                    <th>Giá</th>
                  </tr>
                </thead>
                <tbody>
                  {booking.BookingDetails.map((detail, index) => (
                    <tr key={index}>
                      <td>{detail.RoomName}</td>
                      <td>{detail.Quantity}</td>
                      <td>{new Intl.NumberFormat().format(detail.Price)} đ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="total">
                <strong>Tổng cộng: {new Intl.NumberFormat().format(booking.Total)} đ</strong>
              </div>
            </div>
          ))
        ) : (
          <p>Chưa có lịch sử đặt phòng.</p>
        )} */}
      </div>
    );
  };
  

export default BookingHistory;
