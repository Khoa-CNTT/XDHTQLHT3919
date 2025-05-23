import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import userApi from "../../../services/api/AuthAPI/user";
import Notification from "../Other/Notification";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [notification, setNotification] = useState({ show: false, message: "" });

  const navigate = useNavigate();

  const showNotification = (message) => {
    setNotification({ show: true, message });
  };

  const handleCloseNotification = () => {
    setNotification({ show: false, message: "" });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showNotification("Mật khẩu mới không khớp!");
      return;
    }

    try {
      const idUser = localStorage.getItem("idUser");

      const data = {
        idUser,
        oldPassword,
        newPassword,
      };

      const response = await userApi.changePassword(data);

      if (response.status === 200) {
        showNotification("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
        setTimeout(() => navigate("/login"), 3000); // chuyển sau 3s
      } else {
        showNotification(response.message || "Đổi mật khẩu thất bại!");
      }
    } catch (error) {
      console.error("Lỗi đổi mật khẩu:", error);
      showNotification("Đã xảy ra lỗi khi đổi mật khẩu!");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h2 className="auth-title">Đổi mật khẩu</h2>
        <form className="auth-form" onSubmit={handleChangePassword}>
          <input
            type="password"
            placeholder="Mật khẩu cũ"
            className="auth-input"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mật khẩu mới"
            className="auth-input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Xác nhận mật khẩu mới"
            className="auth-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="submit" className="auth-button">Đổi mật khẩu</button>
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

export default ChangePassword;
