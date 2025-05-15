import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../assets/Style/home-css/paymentMethod.css';

const PaymentMethod = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Lấy bookingData từ state hoặc localStorage
  const bookingData =
    location.state?.bookingData || JSON.parse(localStorage.getItem('bookingData'));
  console.log('bookingData:', bookingData);

  // Kiểm tra dữ liệu bookingData
  if (
    !bookingData ||
    !bookingData.total ||
    !bookingData.idUser ||
    !bookingData.bookingDetails ||
    !Array.isArray(bookingData.bookingDetails) ||
    bookingData.bookingDetails.length === 0
  ) {
    return (
      <div className="payment-container">
        <h2>Không có dữ liệu thanh toán</h2>
        <p>Vui lòng đặt phòng lại.</p>
        <button onClick={() => navigate('/booking')} className="cancel-btn">
          Quay lại trang đặt phòng
        </button>
      </div>
    );
  }

  // Lấy thông tin cần thiết
  const bookingId = bookingData.bookingId;
  const checkInDate = bookingData.checkInDate || bookingData.bookingDetails[0]?.checkInDate;
  const checkOutDate = bookingData.checkOutDate || bookingData.bookingDetails[0]?.checkOutDate;
  const note = bookingData.note || bookingData.bookingDetails[0]?.note;
  const idBookingDetail = bookingData.bookingDetails[0]?.idBookingDetail; // Nếu backend trả về, còn không có thì có thể bỏ qua

 const handleVNPayPayment = async () => {
  setLoading(true);
  try {
    const response = await axios.post('https://localhost:7154/api/Payment/create-payment', {
      idUser: bookingData.idUser,
      total: bookingData.total,
      idBooking: bookingId,
      checkInDate,
      checkOutDate,
      note,
      bookingDetails: bookingData.bookingDetails,
    });

    const { url } = response.data;

    if (url) {
      window.location.href = url;
    } else {
      alert('Không thể tạo URL thanh toán. Vui lòng thử lại.');
    }
  } catch (error) {
    console.error('Lỗi khi tạo thanh toán VNPay:', error);

    if (error.response) {
      alert(`Lỗi từ server: ${error.response.data.message || 'Không thể tạo thanh toán.'}`);
    } else if (error.request) {
      alert('Không nhận được phản hồi từ server. Vui lòng thử lại.');
    } else {
      alert('Có lỗi xảy ra khi cấu hình yêu cầu thanh toán.');
    }
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="payment-container">
      <h2>Xác nhận thanh toán</h2>
      <div className="payment-details">
        <p>
          <strong>Mã đặt phòng:</strong> {bookingId}
        </p>
        <p>
          <strong>Ngày nhận phòng:</strong> {checkInDate ? new Date(checkInDate).toLocaleDateString() : '---'}
        </p>
        <p>
          <strong>Ngày trả phòng:</strong> {checkOutDate ? new Date(checkOutDate).toLocaleDateString() : '---'}
        </p>
        <p>
          <strong>Tổng tiền:</strong> {Number(bookingData.total).toLocaleString()} VND
        </p>
        <p>
          <strong>Ghi chú:</strong> {note || '---'}
        </p>
        <p>
          <strong>Phương thức:</strong> VNPay
        </p>
      </div>
      <button onClick={handleVNPayPayment} className="pay-btn" disabled={loading}>
        {loading ? 'Đang xử lý...' : 'Thanh toán qua VNPay'}
      </button>
      <button onClick={() => navigate('/')} className="cancel-btn">
        Hủy
      </button>
    </div>
  );
};

export default PaymentMethod;