import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../../services/api/Login";
import { FaArrowLeft } from "react-icons/fa";
import SHA256 from "crypto-js/sha256"; // ✅ Thêm dòng này

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Vui lòng nhập đầy đủ email và mật khẩu!");
      return;
    }

    // ✅ Mã hóa mật khẩu bằng SHA256 trước khi gửi
    const hashedPassword = SHA256(password).toString();
    const credentials = { email, password: hashedPassword };
    console.log("Đang gửi dữ liệu: ", credentials);

    try {
      const response = await login(credentials);
      console.log("Dữ liệu trả về từ backend: ", response);

      const res = response?.data;
      const status = res?.status;
      const message = res?.message;
      const user = res?.data;

      if (status === 200 && user) {
        alert("Đăng nhập thành công!");

        localStorage.setItem("userId", user.id);
        localStorage.setItem("email", user.email);
        localStorage.setItem("username", user.name || user.email);
        localStorage.setItem("role", user.role);
        localStorage.setItem("avatarUrl", user.pathImg || "");

        navigate("/home");
      } else {
        alert(message || "Đăng nhập thất bại! Tài khoản hoặc mật khẩu không đúng.");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      const errorMessage =
        error.response?.data?.message || "Đăng nhập thất bại, vui lòng thử lại!";
      alert(errorMessage);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <button className="back-button" onClick={() => navigate("/")}>
          <FaArrowLeft />
        </button>
        <h2 className="auth-title">Đăng nhập</h2>
        <form className="auth-form" onSubmit={handleLogin}>
          <div>
            <label>Email</label>
            <input
              type="email"
              placeholder="Nhập email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label>Mật khẩu</label>
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
        {message && <p className="auth-message">{message}</p>}
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
