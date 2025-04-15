import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import userApi from "../../../api/AuthAPI/user";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Mật khẩu mới không khớp!");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // ✅ Lấy token từ localStorage
      const username = localStorage.getItem("username"); // ✅ Nếu backend cần Username

      const data = {
        oldPassword,
        newPassword,
      };

      const response = await userApi.changePassword(token, data, username); // ✅ Gọi đúng API

      if (response.status === 200) {
        alert("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
        navigate("/login");
      } else {
        alert("Đổi mật khẩu thất bại!");
      }
    } catch (error) {
      console.error("Lỗi đổi mật khẩu:", error);
      const message =
        error.response?.data?.message || "Có lỗi xảy ra trong quá trình đổi mật khẩu!";
      alert(message);
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
    </div>
  );
}

export default ChangePassword;
