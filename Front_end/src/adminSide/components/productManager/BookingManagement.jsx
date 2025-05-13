import React, { useState, useEffect } from 'react';
import { getAllBookingsWithDetails } from '../../../services/api/userAPI/bookingAPI';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const data = await getAllBookingsWithDetails();
      setBookings(data);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu đơn đặt phòng:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p>Đang tải...</p>;

  return (
    <div className="booking-list">
      <h2>Danh sách đơn đặt phòng</h2>
      {bookings.length > 0 ? (
        <table className="booking-table">
          <thead>
            <tr>
              <th>Tên khách hàng</th>
              <th>Email</th>
              <th>Tên phòng</th>
              <th>Ngày đặt</th>
              <th>Ngày check-in</th>
              <th>Ngày check-out</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Thanh toán</th>
              <th>Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.name || 'Không rõ'}</td>
                <td>{booking.userEmail || 'Không rõ'}</td>
                <td>{booking.roomName || 'Không rõ'}</td>
                <td>
                  {booking.createAt
                    ? new Date(booking.createAt).toLocaleString()
                    : 'Không rõ'}
                </td>
                <td>
                  {booking.checkInDate
                    ? new Date(booking.checkInDate).toLocaleDateString()
                    : 'Không rõ'}
                </td>
                <td>
                  {booking.checkOutDate
                    ? new Date(booking.checkOutDate).toLocaleDateString()
                    : 'Không rõ'}
                </td>
                <td>
                  {booking.total
                    ? `${booking.total.toLocaleString()} VND`
                    : 'Không rõ'}
                </td>
                <td>{booking.status || 'Không rõ'}</td>
                <td>{booking.paymentMethod || 'Không rõ'}</td>
                <td>{booking.note || 'Không có ghi chú'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Không có đơn đặt phòng nào.</p>
      )}
    </div>
  );
};

export default BookingList;
