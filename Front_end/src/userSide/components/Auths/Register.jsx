import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../../services/api/AuthAPI/registerAPI";
import { FaEnvelope, FaPhone, FaEye, FaEyeSlash } from "react-icons/fa";
import Notification from "../Other/Notification";

function Register() {
  const [isEmail, setIsEmail] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Trạng thái hiển thị mật khẩu
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false); // Trạng thái hiển thị mật khẩu xác nhận
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "" });

  const navigate = useNavigate();

  const showNotification = (message) => {
    setNotification({ show: true, message });
  };

  const handleCloseNotification = () => {
    setNotification({ show: false, message: "" });
  };

  const handlePhoneInput = (e) => {
    let input = e.target.value.replace(/\D/g, "");
    if (input.startsWith("0")) {
      input = input;
    } else if (input.length > 0) {
      input = "0" + input;
    }
    setPhoneNumber(input);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phoneNumber.trim();

    if (!trimmedName || !password || !confirmPassword || (isEmail && !trimmedEmail) || (!isEmail && !trimmedPhone)) {
      showNotification("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (password !== confirmPassword) {
      showNotification("Mật khẩu xác nhận không khớp!");
      return;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
    const isValidPhoneNumber = /^[0-9]{10}$/.test(trimmedPhone);

    if (isEmail) {
      if (!isValidEmail) {
        showNotification("Email không hợp lệ!");
        return;
      }

      // Kiểm tra xem email có phải là @gmail.com không
      const isGmail = trimmedEmail.endsWith("@gmail.com");
      if (!isGmail) {
        showNotification("Email phải có đuôi @gmail.com!");
        return;
      }
    } else {
      if (!isValidPhoneNumber) {
        showNotification("Số điện thoại không hợp lệ! (Ví dụ: 0987654321)");
        return;
      }
    }

    const registerData = {
      name: trimmedName,
      password: password,
      idRole: "0d215690-3ece-478d-8f3a-20935a0f822f",
    };

    if (isEmail) {
      registerData.email = trimmedEmail;
    } else {
      registerData.phone = trimmedPhone;
    }

    setIsSubmitting(true);

    try {
  const response = await register(registerData);
  console.log("Phản hồi từ backend:", response);

  showNotification("Đăng ký thành công!");
  setTimeout(() => navigate("/login"), 3000);
} catch (error) {
  console.error("Lỗi đăng ký:", error);
  
  const message =
    error.response?.data?.message ||
    "Lỗi đăng ký! Vui lòng thử lại.";

  showNotification(message);
} finally {
  setIsSubmitting(false);
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
                <label className="label_text">Email</label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  className="auth-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            ) : (
              <div>
                <label className="label_text">Số điện thoại</label>
                <input
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  className="auth-input"
                  value={phoneNumber}
                  onChange={handlePhoneInput}
                  disabled={isSubmitting}
                />
              </div>
            )}

            <div>
              <label className="label_text">Tên người dùng</label>
              <input
                type="text"
                placeholder="Nhập tên"
                className="auth-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="label_text">Mật khẩu</label>
              <div className="password-container">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="••••••••"
                  className="auth-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div>
              <label className="label_text">Xác nhận mật khẩu</label>
              <div className="password-container">
                <input
                  type={isConfirmPasswordVisible ? "text" : "password"}
                  placeholder="••••••••"
                  className="auth-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                >
                  {isConfirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>


            <button type="submit" className="auth-button" disabled={isSubmitting}>Đăng ký</button>
          </form>
        </div>

        <p className="auth-footer">
          Bạn đã có tài khoản?{" "}
          <button className="btn" onClick={() => navigate("/login")}>Đăng nhập ngay</button>
        </p>
      </div>

      <Notification
        message={notification.message}
        show={notification.show}
        onClose={handleCloseNotification}
      />
    </div>
  );
}

export default Register;
