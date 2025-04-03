import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/Style/Auth.css";
import { register } from "../../api/Register";
import { FaEnvelope, FaPhone } from "react-icons/fa";

function Register() {
  const [isEmail, setIsEmail] = useState(true);
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  const handleRegister = async (e) => {
    e.preventDefault();

    if ((isEmail && !email) || (!isEmail && !phoneNumber) || !password || !confirmPassword) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (!isEmail && (phoneNumber.length < 10 || !phoneNumber.match(/^\+84\d{9}$/))) {
      alert("Số điện thoại không hợp lệ!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không trùng khớp!");
      return;
    }

    try {
      const response = await register({ email, phoneNumber, password });
      if (response.status === 201) {
        alert("Đăng ký thành công! Vui lòng đăng nhập.");
        navigate("/login");
      } else {
        alert("Có lỗi xảy ra, vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      if (error.response) {
        if (error.response.data.errors) {
          let errorMessages = Object.values(error.response.data.errors).flat().join("\n");
          alert(errorMessages);
        } else if (error.response.data.message) {
          alert(error.response.data.message);
        } else {
          alert("Có lỗi xảy ra khi đăng ký!");
        }
      } else {
        alert("Không kết nối được đến server!");
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h2 className="auth-title">Đăng ký</h2>
        <p className="auth-subtitle">Tạo tài khoản để sử dụng dịch vụ</p>

        {/* Chuyển đổi Email / Số điện thoại */}
        <div className="auth-toggle-input">
          <button className={isEmail ? "active" : ""} onClick={() => setIsEmail(true)}>
            <FaEnvelope /> Email
          </button>
          <button className={!isEmail ? "active" : ""} onClick={() => setIsEmail(false)}>
            <FaPhone /> Số điện thoại
          </button>
        </div>
<form className="auth-form" onSubmit={handleRegister}>
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

          <div>
            <label>Xác nhận mật khẩu</label>
            <input
              type="password"
              placeholder="••••••••"
              className="auth-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="auth-button">Đăng ký</button>
        </form>

        <p className="auth-footer">
          Bạn đã có tài khoản? <button className="btn" onClick={() => navigate("/login")}>Đăng nhập ngay</button>
        </p>
      </div>
    </div>
  );
}

export default Register;