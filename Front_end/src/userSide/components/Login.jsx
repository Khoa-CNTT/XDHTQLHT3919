import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/Style/Auth.css";
import { login } from '../../api/Login';
import { FaEnvelope, FaPhone } from "react-icons/fa";

function Login() {
  const [isEmail, setIsEmail] = useState(true);
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handlePhoneInput = (e) => {
    let input = e.target.value.replace(/\D/g, ""); // Chỉ giữ số
    if (!input.startsWith("+84")) {
      if (input.startsWith("84")) {
        input = "+84" + input.slice(2);
      } else if (input.startsWith("0")) {
        input = "+84" + input.slice(1);
      } else {
        input = "+84" + input;
      }
    }
    setPhoneNumber(input);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if ((isEmail && !email) || (!isEmail && !phoneNumber) || !password) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      const response = await login({ email, phoneNumber, password });
      if (response.data?.token) {
        alert("Đăng nhập thành công!");
        localStorage.setItem("token", response.data.token);
        navigate("/home");
      } else {
        alert("Đăng nhập thất bại! Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      const errorMessage = error.response?.data?.message || "Tài khoản hoặc mật khẩu không đúng!";
      alert(errorMessage);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h2 className="auth-title">Đăng nhập</h2>

        {/* Chuyển đổi Email / Số điện thoại */}
        <div className="auth-toggle-input">
          <button className={isEmail ? "active" : ""} onClick={() => setIsEmail(true)}>
            <FaEnvelope /> Email
          </button>
          <button className={!isEmail ? "active" : ""} onClick={() => setIsEmail(false)}>
            <FaPhone /> Số điện thoại
          </button>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>
          {isEmail ? (
            <div>
              <label>Email</label>
              <input
                type="email"
                placeholder="your.email@example.com"
                className="auth-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          ) : (
            <div>
              <label>Số điện thoại</label>
              <input
                type="tel"
                placeholder="Nhập số điện thoại"
                className="auth-input"
                value={phoneNumber}
                onChange={handlePhoneInput}
              />
            </div>
          )}

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

        <p className="auth-footer">
          Bạn chưa có tài khoản? <button className="btn" onClick={() => navigate("/register")}>Đăng ký ngay</button>
        </p>
        <p className="auth-footer" onClick={() => navigate("/change-password")}>
          Quên mật khẩu?
        </p>
      </div>
    </div>
  );
}

export default Login;
