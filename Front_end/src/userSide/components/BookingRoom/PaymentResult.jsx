import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../../assets/Style/others-css/payment-result.css';
const PaymentResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy query params từ URL
  const query = new URLSearchParams(location.search);
  const responseCode = query.get('vnp_ResponseCode');

  return (
    <div className="payment-result-container">
      <h2>
        {responseCode === '00'
          ? 'Thanh toán thành công!'
          : 'Thanh toán thất bại hoặc bị hủy.'}
      </h2>
      <button onClick={() => navigate('/')}>Về trang chủ</button>
    </div>
  );
};

export default PaymentResult;