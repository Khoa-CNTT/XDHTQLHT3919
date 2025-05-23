import React, { useState, useEffect } from 'react';
import {
  getAllBookings,
  updateBookingEdit,
  deleteBooking, // Import hàm xóa
} from '../../../services/api/userAPI/bookingAPI';
import '../../../assets/Style/admin-css/booking-management.css';

export default function BookingManagement() {
  const [bookingDetails, setBookingDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [editingBooking, setEditingBooking] = useState(null);

  // Lấy dữ liệu từ API booking
  const fetchData = async () => {
    setLoading(true);
    try {
      const bookingResult = await getAllBookings();

      if (bookingResult && bookingResult.status === 200 && Array.isArray(bookingResult.data)) {
        setBookingDetails(bookingResult.data);
      } else {
        setBookingDetails([]);
        alert('Không tìm thấy dữ liệu');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Có lỗi xảy ra khi tải dữ liệu');
      setBookingDetails([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleConfirm = async (id) => {
    try {
      const result = await updateBookingEdit(id, 'Đã xác nhận');
      if (result) {
        const updatedBookings = bookingDetails.map((item) =>
          item.idBooking === id ? { ...item, status: 'Đã xác nhận' } : item
        );
        setBookingDetails(updatedBookings);
        alert('Trạng thái đã được cập nhật thành "Đã xác nhận".');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      alert('Cập nhật trạng thái thất bại.');
    }
  };

  const handleCancel = async (id) => {
    try {
      const result = await updateBookingEdit(id, 'Chưa xác nhận');
      if (result) {
        const updatedBookings = bookingDetails.map((item) =>
          item.idBooking === id ? { ...item, status: 'Chưa xác nhận' } : item
        );
        setBookingDetails(updatedBookings);
        alert('Trạng thái đã được cập nhật thành "Chưa xác nhận".');
      }
    } catch (error) {
      console.error('Lỗi khi hủy trạng thái:', error);
      alert('Hủy thất bại.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await deleteBooking(id);
      if (result) {
        const updatedBookings = bookingDetails.filter((item) => item.idBooking !== id);
        setBookingDetails(updatedBookings);
        alert('Đã xóa đơn đặt phòng thành công.');
      }
    } catch (error) {
      console.error('Lỗi khi xóa đơn đặt phòng:', error);
      alert('Xóa thất bại.');
    }
  };

  const handleSort = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const filteredAndSortedBookings = bookingDetails
    .filter((item) =>
(item.userEmail || '').toLowerCase().includes(searchKeyword.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === 'asc' ? a.total - b.total : b.total - a.total
    );

  return (
    <div className="booking-management-container">
      <h1 className="booking-management-title">Quản lý Booking</h1>
      <div className="booking-management-tools">
        <input
          type="text"
          placeholder="Tìm kiếm theo email người dùng..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="booking-management-input search-input"
        />
        <button className="booking-management-button sort-button" onClick={handleSort}>
          Sắp xếp theo tổng tiền: {sortOrder === 'asc' ? 'Tăng' : 'Giảm'}
        </button>
      </div>

      <div className="booking-management-table-section">
        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : (
          <table className="booking-management-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Trạng thái</th>
                <th>Phương thức thanh toán</th>
                <th>Tổng tiền</th>
                <th>Ngày tạo</th>
                <th>Hành động</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Tên phòng</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedBookings.length > 0 ? (
                filteredAndSortedBookings.map((item) => (
                  <tr key={item.idBooking}>
                    <td>{item.userEmail}</td>
                    <td>{item.status}</td>
                    <td>{item.paymentMethod}</td>
                    <td>{item.total?.toLocaleString()} đ</td>
                    <td>{new Date(item.createAt).toLocaleDateString()}</td>
                    <td>{new Date(item.checkIn).toLocaleDateString()}</td>
                    <td>{new Date(item.checkOut).toLocaleDateString()}</td>
                    <td>{item.roomName}</td>
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
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>
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