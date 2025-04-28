import React, { useState, useEffect } from 'react';
import { bookingApi } from '../../../services/api/adminAPI/bookingApi';
import '../../../assets/Style/admin-css/booking-management.css';

export default function BookingManagement() {
  const [bookingDetails, setBookingDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [editingItem, setEditingItem] = useState(null);
  const [editData, setEditData] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await bookingApi.getAllBookingDetails();
      if (result.status === 200 && Array.isArray(result.data)) {
        setBookingDetails(result.data);
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

  const handleEdit = (item) => {
    setEditingItem(item.id);
    setEditData({ ...item });
  };

  const handleSaveEdit = async () => {
    const updatedBookings = bookingDetails.map((item) =>
      item.id === editingItem ? { ...editData } : item
    );
    setBookingDetails(updatedBookings);
    setEditingItem(null);
    // Optionally update API here
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditData({});
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa booking này?')) {
      const result = await bookingApi.deleteBookingDetail(id);
      if (result.status === 200) {
        alert('Xóa thành công');
        fetchData();
      } else {
        alert('Xóa thất bại');
      }
    }
  };

  const handleConfirm = async (id) => {
    const booking = bookingDetails.find(x => x.id === id);
    let nextStatus = '';
    if (!booking?.status || booking.status === 'chưa xác nhận') {
      nextStatus = 'đang xác nhận';
    } else if (booking.status === 'đang xác nhận') {
      nextStatus = 'đã xác nhận';
    }
    const result = await bookingApi.updateBookingStatus(id, nextStatus);
    if (result.status === 200) {
      const updatedBookings = bookingDetails.map((item) =>
        item.id === id ? { ...item, status: nextStatus } : item
      );
      setBookingDetails(updatedBookings);
    } else {
      alert('Cập nhật trạng thái thất bại');
    }
  };

  const handleCancel = async (id) => {
    const booking = bookingDetails.find(x => x.id === id);
    if (booking?.status === 'đang xác nhận') {
      const result = await bookingApi.updateBookingStatus(id, 'chưa xác nhận');
      if (result.status === 200) {
        const updatedBookings = bookingDetails.map((item) =>
          item.id === id ? { ...item, status: 'chưa xác nhận' } : item
        );
        setBookingDetails(updatedBookings);
      } else {
        alert('Hủy thất bại');
      }
    }
  };

  const handleSort = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const filteredAndSortedBookings = bookingDetails
    .filter(item => (item.roomName || '').toLowerCase().includes(searchKeyword.toLowerCase()))
    .sort((a, b) => sortOrder === 'asc' ? a.totalPrice - b.totalPrice : b.totalPrice - a.totalPrice);

  return (
    <div className="booking-management-container">
      <h1 className="booking-management-title">Quản lý Booking</h1>
      <div className="booking-management-tools">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên phòng..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="booking-management-input search-input"
        />
        <button className="booking-management-button">Lọc</button>
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
                <th>Phòng</th>
                <th>Ngày Check-In</th>
                <th>Ngày Check-Out</th>
                <th>Ghi chú</th>
                <th>Tổng tiền</th>
                <th>Room ID</th>
                <th>Order ID</th>
                <th>Chỉnh sửa / Xóa</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedBookings.length > 0 ? (
                filteredAndSortedBookings.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {editingItem === item.id ? (
                        <input
                          value={editData.roomName || ''}
                          onChange={(e) => setEditData({ ...editData, roomName: e.target.value })}
                        />
                      ) : (
                        item.roomName
                      )}
                    </td>
                    <td>
                      {editingItem === item.id ? (
                        <input
                          type="date"
                          value={editData.checkInDate?.slice(0, 10) || ''}
                          onChange={(e) => setEditData({ ...editData, checkInDate: e.target.value })}
                        />
                      ) : (
                        new Date(item.checkInDate).toLocaleDateString()
                      )}
                    </td>
                    <td>
                      {editingItem === item.id ? (
                        <input
                          type="date"
                          value={editData.checkOutDate?.slice(0, 10) || ''}
                          onChange={(e) => setEditData({ ...editData, checkOutDate: e.target.value })}
                        />
                      ) : (
                        new Date(item.checkOutDate).toLocaleDateString()
                      )}
                    </td>
                    <td>
                      {editingItem === item.id ? (
                        <input
                          value={editData.note || ''}
                          onChange={(e) => setEditData({ ...editData, note: e.target.value })}
                        />
                      ) : (
                        item.note
                      )}
                    </td>
                    <td>
                      {editingItem === item.id ? (
                        <input
                          type="number"
                          value={editData.totalPrice || ''}
                          onChange={(e) => setEditData({ ...editData, totalPrice: e.target.value })}
                        />
                      ) : (
                        item.totalPrice?.toLocaleString() + 'đ'
                      )}
                    </td>
                    <td>
                      <input value={item.roomId} disabled className="readonly-input" />
                    </td>
                    <td>
                      <input value={item.orderId} disabled className="readonly-input" />
                    </td>
                    <td className="booking-management-actions">
                      {editingItem === item.id ? (
                        <>
                          <button className="booking-edit-btn" onClick={handleSaveEdit}>Lưu</button>
                          <button className="booking-cancel-btn" onClick={handleCancelEdit}>Hủy</button>
                        </>
                      ) : (
                        <>
                          <button className="booking-edit-btn" onClick={() => handleEdit(item)}>Sửa</button>
                          <button className="booking-delete-btn" onClick={() => handleDelete(item.id)}>Xóa</button>
                        </>
                      )}
                    </td>
                    <td className="booking-management-actions">
                      {item.status === 'đã xác nhận' ? (
                        <span className="booking-status-confirmed">Đã xác nhận</span>
                      ) : item.status === 'đang xác nhận' ? (
                        <span className="booking-status-pending">Đang xác nhận</span>
                      ) : (
                        <span className="booking-status-new">Chưa xác nhận</span>
                      )}
                      {item.status !== 'đã xác nhận' && (
                        <div className="booking-management-action-buttons">
                          <button className="booking-confirm-btn" onClick={() => handleConfirm(item.id)}>Xác nhận</button>
                          {item.status === 'đang xác nhận' && (
                            <button className="booking-cancel-btn" onClick={() => handleCancel(item.id)}>Hủy</button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center' }}>Không có dữ liệu</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
