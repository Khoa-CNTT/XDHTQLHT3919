import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../../services/api/AuthAPI/Login";
import { FaArrowLeft } from "react-icons/fa";
import Notification from "../../components/Other/Notification";

function Login() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showNoti, setShowNoti] = useState(false);
  const [notiMessage, setNotiMessage] = useState("");
  const navigate = useNavigate();

  const showNotification = (message) => {
    setNotiMessage(message);
    setShowNoti(true);
    setTimeout(() => setShowNoti(false), 3000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!emailOrPhone || !password) {
      showNotification("Vui lòng nhập email/số điện thoại và mật khẩu!");
      return;
    }

    try {
      const response = await login({
        userLogin: emailOrPhone.trim(),
        password,
      });

      const { token, user } = response;

      if (token) {
        showNotification("Đăng nhập thành công!");

        const userImg = user.pathImg || "avatar.jpg";

        localStorage.setItem("token", token);
        localStorage.setItem("email", user.email || "");
        localStorage.setItem("username", user.name || "");
        localStorage.setItem("img", userImg);
        localStorage.setItem("role", user.role || "user");
        localStorage.setItem("idRole", user.idRole || "");
        localStorage.setItem("address", user.address || "");
        localStorage.setItem("phone", user.phone || "");
        localStorage.setItem("idUser", user.id || "");

        setTimeout(() => {
          navigate(user.role === "admin" ? "/dashboard" : "/home");
        }, 1000);
      } else {
        showNotification("Đăng nhập thất bại! Token không hợp lệ.");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      const errorMessage =
        error.response?.data?.message || "Đăng nhập thất bại, vui lòng thử lại!";
      showNotification(errorMessage);
    }
  };

  return (
    <div className="auth-wrapper">
      <Notification message={notiMessage} show={showNoti} onClose={() => setShowNoti(false)} />
      <div className="auth-container">
        <button className="back-button" onClick={() => navigate("/")}>
          <FaArrowLeft />
        </button>
        <h2 className="auth-title">Đăng nhập</h2>
        <form className="auth-form" onSubmit={handleLogin}>
          <div>
            <label className="labe">Email hoặc Số điện thoại</label>
            <input
              type="text"
              placeholder="Nhập email hoặc số điện thoại"
              className="auth-input"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
            />
          </div>
          <div>
            <label className="labe">Mật khẩu</label>
            <input
              type="password"
              placeholder="••••••••"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="auth-button">Đăng nhập</button>
        </form>
        <p className="auth-footer">
          Bạn chưa có tài khoản?{" "}
          <button className="btn" onClick={() => navigate("/register")}>
            Đăng ký ngay
          </button>
        </p>
        <p className="auth-footer" onClick={() => navigate("/forgot")}>
          Quên mật khẩu?
        </p>
      </div>
    </div>
  );
}

export default Login;
