import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import userApi from "../../../services/api/AuthAPI/user";
import Notification from "../Other/Notification";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [notification, setNotification] = useState({ show: false, message: "" });

  const showNotification = (message) => {
    setNotification({ show: true, message });
  };

  const handleCloseNotification = () => {
    setNotification({ show: false, message: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      showNotification("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    if (newPassword !== confirmPassword) {
      showNotification("Mật khẩu không khớp.");
      return;
    }

    try {
      const res = await userApi.resetPassword({ token, newPassword, confirmPassword });
      showNotification(res.message || "Đặt lại mật khẩu thành công!");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      showNotification(err.response?.data?.message || "Có lỗi xảy ra.");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h2 className="auth-title">Đặt lại mật khẩu</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Mật khẩu mới"
            className="auth-input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Xác nhận mật khẩu"
            className="auth-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className="auth-button">Xác nhận</button>
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

export default ResetPassword;
