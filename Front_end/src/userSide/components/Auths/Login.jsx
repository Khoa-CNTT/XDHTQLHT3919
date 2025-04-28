import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../../services/api/AuthAPI/Login";
import { FaArrowLeft } from "react-icons/fa";
import Notification from "../../components/Other/Notification";


function Login() {
  const [email, setEmail] = useState("");
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
  
    if (!email || !password) {
      showNotification("Vui lòng nhập đầy đủ email và mật khẩu!");
      return;
    }
  
    const credentials = { email, password };
    console.log("Đang gửi dữ liệu: ", credentials);
  
    try {
      const response = await login(credentials);
      console.log("Dữ liệu trả về từ backend: ", response);
  
      const { status, token, user } = response;
  
      if (status === 200 && token) {
        showNotification("Đăng nhập thành công!");
  
        const userImg = user.pathImg || "avatar.jpg";  // Đảm bảo pathImg có giá trị mặc định nếu không có ảnh
  
        // Lưu trữ thông tin vào localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("email", user.email);
        localStorage.setItem("username", user.name);
        localStorage.setItem("img", userImg);
        localStorage.setItem("role", user.role || "user");
        localStorage.setItem("idRole", user.idRole);
        localStorage.setItem("address", user.address || "");
        localStorage.setItem("phone", user.phone || "");
  
        // Chuyển hướng dựa trên vai trò
        if (user.role === "admin") {
          setTimeout(() => navigate("/dashboard"), 1000);
        } else {
          setTimeout(() => navigate("/home"), 1000);
        }
      } else {
        showNotification("Đăng nhập thất bại! Tài khoản hoặc mật khẩu không đúng.");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Đăng nhập thất bại, vui lòng kiểm tra lại!";
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
            <label className="labe">Email</label>
            <input
              type="email"
              placeholder="Nhập email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
        <p className="auth-footer" onClick={() => navigate("/change")}>
          Quên mật khẩu?
        </p>
      </div>
    </div>
  );
}

export default Login;