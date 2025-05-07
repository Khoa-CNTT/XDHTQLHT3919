import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userApi from "../../../services/api/AuthAPI/user";
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
  const [errorMessage, setErrorMessage] = useState(null);

  // Notification state
  const [notificationMessage, setNotificationMessage] = useState("");
  const [showNotification, setShowNotification] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("idUser");

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
      pathImg: "",
      role: localStorage.getItem("role") || "",
    };

    setUser(userInfo);
    setUpdatedInfo(userInfo);
  }, [token, userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditClick = () => setIsEditing(true);

  const handleCancelEdit = () => {
    setIsEditing(false);
    setUpdatedInfo(user);
  };

  const handleSaveChanges = async () => {
    try {
      const res = await userApi.updateProfile(token, {
        id: userId,
        name: updatedInfo.name,
        phone: updatedInfo.phone,
        address: updatedInfo.address,
        email: updatedInfo.email,
        pathImg: updatedInfo.pathImg,
      });

      const updatedUser = res.data.data || res.data;

      // Cập nhật state & localStorage
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

          <label>Link ảnh đại diện:</label>
          <input name="pathImg" value={updatedInfo.pathImg} onChange={handleInputChange} />

          <button className="btn-profile" onClick={handleSaveChanges}>Lưu thay đổi</button>
          <button className="btn-profile" onClick={handleCancelEdit}>Hủy</button>
        </div>
      ) : (
        <div>
          <img
            src={user.pathImg || "/images/avatar.jpg"}
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
