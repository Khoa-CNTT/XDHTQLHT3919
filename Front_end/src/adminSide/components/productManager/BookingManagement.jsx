import React, { useState, useEffect } from 'react';
import {
  getAllBookings,
  updateBookingEdit,
  deleteBooking,
  confirmBooking,
  cancelBooking,
} from '../../../services/api/userAPI/bookingAPI';
import { getBookingDetailsByBookingId } from '../../../services/api/userAPI/bookingDetailAPI';
import '../../../assets/Style/admin-css/booking-management.css';

export default function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [bookingDetailMap, setBookingDetailMap] = useState({});

  // Lấy danh sách booking
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await getAllBookings();
      setBookings(res.data || []);
    } catch (err) {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Lọc và sắp xếp
  const filteredAndSortedBookings = bookings
    .filter(item =>
      !searchKeyword ||
      item.userEmail?.toLowerCase().includes(searchKeyword.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === 'asc'
        ? new Date(a.createAt) - new Date(b.createAt)
        : new Date(b.createAt) - new Date(a.createAt)
    );

  // Fetch bookingDetail cho tất cả booking khi danh sách thay đổi
  useEffect(() => {
    filteredAndSortedBookings.forEach(item => {
      if (!bookingDetailMap[item.idBooking]) {
        getBookingDetailsByBookingId(item.idBooking).then(res => {
          setBookingDetailMap(prev => ({
            ...prev,
            [item.idBooking]: Array.isArray(res.data) ? res.data : [],
          }));
        }).catch(() => {
          setBookingDetailMap(prev => ({
            ...prev,
            [item.idBooking]: [],
          }));
        });
      }
    });
    // eslint-disable-next-line
  }, [filteredAndSortedBookings]);

  // Xác nhận booking
  const handleConfirm = async (idBooking) => {
    try {
      await confirmBooking(idBooking);
      alert('Xác nhận thành công!');
      fetchBookings();
    } catch {
      alert('Xác nhận thất bại!');
    }
  };

  // Hủy booking
  const handleCancel = async (idBooking) => {
  try {
    await cancelBooking(idBooking); // Gọi API cancelBooking mới
    alert('Đã hủy booking!');
    fetchBookings();
  } catch {
    alert('Hủy thất bại!');
  }
};

  // Xóa booking
  const handleDelete = async (idBooking) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa booking này?')) return;
    try {
      await deleteBooking(idBooking);
      alert('Đã xóa booking!');
      fetchBookings();
    } catch {
      alert('Xóa thất bại!');
    }
  };

  return (
    <div className="booking-management-container">
      <h1 className="booking-management-title">Quản lý Booking</h1>
      <div className="booking-management-tools">
        <input
          type="text"
          placeholder="Tìm kiếm email..."
          value={searchKeyword}
          onChange={e => setSearchKeyword(e.target.value)}
        />
        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
          <option value="asc">Ngày tạo tăng dần</option>
          <option value="desc">Ngày tạo giảm dần</option>
        </select>
      </div>

      <div className="booking-management-table-section">
        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : (
          <table className="booking-management-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Tên phòng</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Trạng thái</th>
                <th>Phương thức thanh toán</th>
                <th>Tổng tiền</th>
                <th>Ngày tạo</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedBookings.length > 0 ? (
                filteredAndSortedBookings.map((item) => {
                  const details = bookingDetailMap[item.idBooking] || [];
                  const firstDetail = details[0] || {};
                  const roomName = firstDetail.roomName || firstDetail.name || '---';
                  const checkIn = firstDetail.checkInDate
                    ? new Date(firstDetail.checkInDate).toLocaleDateString()
                    : '---';
                  const checkOut = firstDetail.checkOutDate
                    ? new Date(firstDetail.checkOutDate).toLocaleDateString()
                    : '---';

                  return (
                    <tr key={item.idBooking}>
                      <td>{item.userEmail}</td>
                      <td>{roomName}</td>
                      <td>{checkIn}</td>
                      <td>{checkOut}</td>
                      <td>{item.status}</td>
                      <td>{item.paymentMethod}</td>
                      <td>{item.total?.toLocaleString()} đ</td>
                      <td>{new Date(item.createAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="booking-edit-btn"
                          onClick={() => handleConfirm(item.idBooking)}
                        >
                          Xác nhận
                        </button>
                        <button
                          className="booking-cancel-btn"
                          onClick={() => handleCancel(item.idBooking)}
                        >
                          Hủy
                        </button>
                        <button
                          className="booking-delete-btn"
                          onClick={() => handleDelete(item.idBooking)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center' }}>
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
