import React, { useState } from "react";
import userApi from "../../../services/api/AuthAPI/userAPI";
import { useNavigate } from "react-router-dom";
import Notification from "../Other/Notification"; 

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [notification, setNotification] = useState({ show: false, message: "" });
  const navigate = useNavigate();

  const showNotification = (message) => {
    setNotification({ show: true, message });
  };

  const handleCloseNotification = () => {
    setNotification({ show: false, message: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await userApi.forgotPassword(email);
      showNotification(res.message || "Đã gửi hướng dẫn đặt lại mật khẩu tới email của bạn.");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.error("Lỗi khi gửi yêu cầu quên mật khẩu:", err);
      showNotification(err.response?.data?.message || "Gửi yêu cầu thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h2 className="auth-title">Quên mật khẩu</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            className="auth-input"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Đang gửi..." : "Gửi yêu cầu"}
          </button>
        </form>
      </div>
      <Notification
        message={notification.message}
        show={notification.show}
        onClose={handleCloseNotification}
      />
    </div>
  );
}

export default ForgotPassword;
