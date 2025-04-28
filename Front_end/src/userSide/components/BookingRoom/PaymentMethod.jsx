import React, { useState } from "react";
import "../../../assets/Style/Others/paymentMethod.css";

const PaymentMethod = () => {
  const [selectedMethod, setSelectedMethod] = useState("");

  const paymentMethods = [
    { id: "qrpay", label: "Thanh toán QR-PAY", icon: "🏦" },
    { id: "banktransfer", label: "Chuyển khoản ngân hàng", icon: "💸" },
    { id: "visa", label: "Thẻ Visa, Master Card", icon: "💳" },
    { id: "atm", label: "Thẻ ATM/ Tài khoản ngân hàng", icon: "🏧" },
  ];

  const handlePayment = () => {
    if (!selectedMethod) {
      alert("Vui lòng chọn phương thức thanh toán!");
    } else {
      alert(`Bạn đã chọn: ${selectedMethod}`);
      // Xử lý thanh toán tại đây
    }
  };

  const handleBack = () => {
    navigator("/r")
  };

  return (
    <div className="payment-container">
      <div className="payment-header">
        <button className="back-button" onClick={handleBack}>
          ←
        </button>
        <h2 className="payment-title">Phương thức thanh toán</h2>
        
      </div>

      <p className="payment-subtitle">
        Sau khi hoàn tất thanh toán, mã xác nhận phòng sẽ được gửi ngay qua SMS và Email của bạn
      </p>

      <div className="payment-methods">
        {paymentMethods.map((method) => (
          <label
            key={method.id}
            className={`payment-method ${selectedMethod === method.id ? "active" : ""}`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={selectedMethod === method.id}
              onChange={(e) => setSelectedMethod(e.target.value)}
            />
            <span>{method.icon} {method.label}</span>
          </label>
        ))}
      </div>

      <button className="payment-button" onClick={handlePayment}>
        Thanh toán
      </button>

      <p className="payment-footer">
        Bằng cách nhấn nút <span className="highlight">Thanh toán</span>, bạn đồng ý với <br />
        <a href="#" className="link">Điều kiện và điều khoản</a> của chúng tôi
      </p>
    </div>
  );
};

export default PaymentMethod;
