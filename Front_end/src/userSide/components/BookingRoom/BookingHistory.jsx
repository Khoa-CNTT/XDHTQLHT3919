import React, { useState, useEffect } from 'react';
import { getBookingsByUserId } from '../../../services/api/userAPI/bookingAPI';
import { getBookingDetailsByBookingId } from '../../../services/api/userAPI/bookingDetailAPI'; // Sử dụng API đúng
import '../../../assets/Style/others-css/booking-history.css';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);

        const userId = localStorage.getItem('idUser');
        if (!userId) {
          alert('Vui lòng đăng nhập để xem lịch sử đặt phòng.');
          window.location.href = '/login';
          return;
        }

        const response = await getBookingsByUserId(userId);

        if (response && Array.isArray(response.data)) {
          const userBookings = response.data.filter((booking) => booking.idUser === userId);

          // Lấy chi tiết phòng cho từng đặt phòng
          const bookingsWithDetails = await Promise.all(
            userBookings.map(async (booking) => {
              const detailsResponse = await getBookingDetailsByBookingId(booking.idBooking); // Gọi API đúng
              return {
                ...booking,
                bookingDetails: detailsResponse.data || [], // Gắn chi tiết phòng vào từng đặt phòng
              };
            })
          );

          setBookings(bookingsWithDetails);
        } else {
          setBookings([]);
        }
      } catch (err) {
        console.error('Lỗi khi lấy lịch sử đặt phòng:', err);
        setError(err.message || 'Đã xảy ra lỗi.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="booking-history-container">
      <h2 className="booking-history-title">Lịch sử Đặt Phòng</h2>
      {loading ? (
        <p className="loading-message">Đang tải dữ liệu...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : bookings.length > 0 ? (
        <table className="booking-history-table">
        
<thead>
  <tr>
    <th>Tên Phòng</th>
    <th>Trạng Thái</th>
    <th>Tổng Tiền</th>
    <th>Ngày Đặt</th>
    <th>Ngày Check-In</th>
    <th>Ngày Check-Out</th>
    <th>Giá Đã Thanh Toán</th>
  </tr>
</thead>
<tbody>
  {bookings.map((booking) => (
    booking.bookingDetails.map((detail, idx) => (
      <tr key={booking.idBooking + '-' + idx}>
        <td>{detail.roomName}</td>
        <td>
          <span className={`status ${booking.status.toLowerCase().replace(' ', '-')}`}>
            {booking.status}
          </span>
        </td>
        <td>{new Intl.NumberFormat().format(booking.total)} đ</td>
        <td>{new Date(booking.createAt).toLocaleDateString()}</td>
        <td>
          {detail.checkInDate
            ? new Date(detail.checkInDate).toLocaleDateString()
            : 'Chưa xác định'}
        </td>
        <td>
          {detail.checkOutDate
            ? new Date(detail.checkOutDate).toLocaleDateString()
            : 'Chưa xác định'}
        </td>
        <td>
          Giá: {new Intl.NumberFormat().format(detail.totalPrice)} đ
        </td>
      </tr>
    ))
  ))}
</tbody>

        </table>
      ) : (
        <p className="no-bookings-message">Chưa có lịch sử đặt phòng.</p>
      )}
    </div>
  );
};

export default BookingHistory;