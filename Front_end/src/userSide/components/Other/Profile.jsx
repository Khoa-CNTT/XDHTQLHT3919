import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import userApi from "../../../services/api/AuthAPI/userAPI";
import "../../../assets/Style/Auth-css/profile.css";
import Notification from "./Notification";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedInfo, setUpdatedInfo] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    pathImg: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [showNotification, setShowNotification] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("idUser");

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!token) {
      setErrorMessage("Bạn chưa đăng nhập. Vui lòng đăng nhập để xem thông tin.");
      return;
    }

    const userInfo = {
      id: userId,
      email: localStorage.getItem("email") || "",
      name: localStorage.getItem("username") || "",
      phone: localStorage.getItem("phone") || "",
      address: localStorage.getItem("address") || "",
      pathImg: localStorage.getItem("img") || "",
      role: localStorage.getItem("role") || "",
    };

    setUser(userInfo);
    setUpdatedInfo(userInfo);
    setImagePreview(userInfo.pathImg ? `/images/${userInfo.pathImg}` : null);
  }, [token, userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // Chỉ cho phép số
      const numericValue = value.replace(/\D/g, "");
      setUpdatedInfo((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setUpdatedInfo((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Hiển thị preview ảnh
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Lưu file để gửi lên backend
    setUpdatedInfo((prev) => ({
      ...prev,
      file,  // lưu file vào state, backend cần
    }));
  };

  const handleEditClick = () => setIsEditing(true);

  const handleCancelEdit = () => {
    setIsEditing(false);
    setUpdatedInfo(user);
    setImagePreview(user.pathImg ? `/images/${user.pathImg}` : null);
  };

  const handleSaveChanges = async () => {
    // Validate các trường
    if (!updatedInfo.name || updatedInfo.name.length > 100) {
      setNotificationMessage("Tên không được để trống và phải dưới 100 ký tự.");
      setShowNotification(true);
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(updatedInfo.phone)) {
      setNotificationMessage("Số điện thoại không hợp lệ. Chỉ chứa số và có 10 chữ số.");
      setShowNotification(true);
      return;
    }

    const emailRegex = /^[a-zA-Z0-9]+@gmail\.com$/;
    if (!emailRegex.test(updatedInfo.email)) {
      setNotificationMessage("Email không hợp lệ. Chỉ chấp nhận định dạng @gmail.com.");
      setShowNotification(true);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("id", userId);
      formData.append("name", updatedInfo.name);
      formData.append("phone", updatedInfo.phone);
      formData.append("address", updatedInfo.address);
      formData.append("email", updatedInfo.email);

      if (updatedInfo.file) {
        formData.append("avatar", updatedInfo.file);
      } else {
        formData.append("pathImg", updatedInfo.pathImg || "");
      }

      const res = await userApi.updateProfile(token, formData);
      const updatedUser = res.data.data || res.data;

      setUser(updatedUser);
      localStorage.setItem("username", updatedUser.name || "");
      localStorage.setItem("phone", updatedUser.phone || "");
      localStorage.setItem("email", updatedUser.email || "");
      localStorage.setItem("address", updatedUser.address || "");
      localStorage.setItem("img", updatedUser.pathImg || "");

      setIsEditing(false);
      setNotificationMessage("Cập nhật thành công!");
      setShowNotification(true);
    } catch (err) {
      console.error("Lỗi khi cập nhật thông tin:", err.response?.data || err);
      setNotificationMessage("Đã xảy ra lỗi khi cập nhật thông tin.");
      setShowNotification(true);
    }
  };


  const handleChangePasswordClick = () => {
    navigate("/change");
  };

  if (errorMessage) return <div>{errorMessage}</div>;
  if (!user) return <div>Đang tải thông tin...</div>;

  return (
    <div className="profile-container">
      <Notification
        message={notificationMessage}
        show={showNotification}
        onClose={() => setShowNotification(false)}
      />

      <h2>Thông tin tài khoản</h2>
      {isEditing ? (
        <div>
          <label>Tên:</label>
          <input name="name" value={updatedInfo.name} onChange={handleInputChange} />

          <label>Số điện thoại:</label>
          <input name="phone" value={updatedInfo.phone} onChange={handleInputChange} />

          <label>Địa chỉ:</label>
          <input name="address" value={updatedInfo.address} onChange={handleInputChange} />

          <label>Email:</label>
          <input name="email" value={updatedInfo.email} onChange={handleInputChange} />

          <label>Ảnh đại diện:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
          />

          <p>
            Tên file:{" "}
            {updatedInfo.file
              ? updatedInfo.file.name
              : updatedInfo.pathImg
                ? updatedInfo.pathImg
                : "Chưa chọn file"}
          </p>


          <button className="btn-profile" onClick={handleSaveChanges}>
            Lưu thay đổi
          </button>
          <button className="btn-profile" onClick={handleCancelEdit}>
            Hủy
          </button>
        </div>
      ) : (
        <div>
          <img
            src={user.pathImg ? `https://localhost:7154/images/${user.pathImg}` : "/images/avatar.jpg"}
            alt="Avatar"
            className="profile-avatar"
          />
          <p><strong>Tên:</strong> {user.name}</p>
          <p><strong>SĐT:</strong> {user.phone}</p>
          <p><strong>Địa chỉ:</strong> {user.address}</p>
          <p><strong>Email:</strong> {user.email}</p>
          
          <button className="btn-profile" onClick={handleEditClick}>Chỉnh sửa</button>
          <button className="btn-profile" onClick={handleChangePasswordClick}>Đổi mật khẩu</button>
        </div>
      )}
    </div>
  );
};

export default Profile;
