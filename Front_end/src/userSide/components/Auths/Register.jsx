import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { register } from "../../../services/api/AuthAPI/Register";

import { FaEnvelope, FaPhone } from "react-icons/fa";

function Register() {
  const [isEmail, setIsEmail] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const handlePhoneInput = (e) => {
    let input = e.target.value.replace(/\D/g, "");
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

    if (!name || !password || !confirmPassword || !address || (isEmail && !email) || (!isEmail && !phoneNumber)) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    const registerData = {
      name,
      password,
      email: isEmail ? email : "",
      phone: !isEmail ? phoneNumber : "",
      address,
      PathImg: "",
      createAt: new Date().toISOString(),
      idRole: "0c12b645-4b6e-4ddf-99ae-a493eb2a3a52"
    };

    try {
      const response = await register(registerData);
      console.log("Phản hồi từ backend:", response);

      if (response && response.status === 200) {
        alert("Đăng ký thành công!");
        navigate("/login");
      } else {
        alert("Đăng ký thất bại! Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      const message = error.response?.data?.message || "Lỗi đăng ký! Vui lòng thử lại.";
      alert(message);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h2 className="auth-title">Đăng ký</h2>
        <p className="auth-subtitle">Tạo tài khoản để sử dụng dịch vụ</p>

        <div className="auth-form">
          <form onSubmit={handleRegister}>
            <div className="auth-toggle-input">
              <button type="button" className={isEmail ? "active" : ""} onClick={() => setIsEmail(true)}>
                <FaEnvelope /> Email
              </button>
              <button type="button" className={!isEmail ? "active" : ""} onClick={() => setIsEmail(false)}>
                <FaPhone /> Số điện thoại
              </button>
            </div>

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
              <label>Tên người dùng</label>
              <input
                type="text"
                placeholder="Nhập tên"
                className="auth-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label>Địa chỉ</label>
              <input
                type="text"
                placeholder="Nhập địa chỉ"
                className="auth-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
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
        </div>
        <p className="auth-footer">
          Bạn đã có tài khoản?{" "}
          <button className="btn" onClick={() => navigate("/login")}>Đăng nhập ngay</button>
        </p>
      </div>
    </div>
  );
}

export default Register;
