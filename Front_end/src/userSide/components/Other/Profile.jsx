import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userApi from "../../../services/api/AuthAPI/user";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedInfo, setUpdatedInfo] = useState({
    name: "",
    phoneNumber: "",
    address: "",
    email: "",
    pathImg: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id");

  useEffect(() => {
    if (!token) {
      setErrorMessage("Bạn chưa đăng nhập. Vui lòng đăng nhập để xem thông tin.");
      return;
    }

    const userInfo = {
      id: userId,
      email: localStorage.getItem("email"),
      name: localStorage.getItem("name"),
      phoneNumber: localStorage.getItem("phone"),
      address: localStorage.getItem("address"),
      pathImg: localStorage.getItem("pathImg"),
      role: localStorage.getItem("role"),
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
      const res = await userApi.updateProfile({
        id: userId,
        name: updatedInfo.name,
        phoneNumber: updatedInfo.phoneNumber,
        address: updatedInfo.address,
        email: updatedInfo.email,
        pathImg: updatedInfo.pathImg,
      }, token);

      const updatedUser = res.data.data || res.data;

      // Update state và localStorage
      setUser(updatedUser);
      Object.entries(updatedUser).forEach(([key, value]) =>
        localStorage.setItem(key, value)
      );

      setIsEditing(false);
      alert("Cập nhật thành công!");
    } catch (err) {
      console.error("Lỗi khi cập nhật thông tin:", err);
      alert("Đã xảy ra lỗi khi cập nhật thông tin.");
    }
  };

  if (errorMessage) return <div>{errorMessage}</div>;
  if (!user) return <div>Đang tải thông tin...</div>;

  return (
    <div className="profile-container">
      <h2>Thông tin tài khoản</h2>
      {isEditing ? (
        <div>
          <label>Tên:</label>
          <input name="name" value={updatedInfo.name} onChange={handleInputChange} />

          <label>Số điện thoại:</label>
          <input name="phoneNumber" value={updatedInfo.phoneNumber} onChange={handleInputChange} />

          <label>Địa chỉ:</label>
          <input name="address" value={updatedInfo.address} onChange={handleInputChange} />

          <label>Email:</label>
          <input name="email" value={updatedInfo.email} onChange={handleInputChange} />

          <label>Link ảnh đại diện (PathImg):</label>
          <input name="pathImg" value={updatedInfo.pathImg} onChange={handleInputChange} />

          <button onClick={handleSaveChanges}>Lưu thay đổi</button>
          <button onClick={handleCancelEdit}>Hủy</button>
        </div>
      ) : (
        <div>
          <img
            src={user.pathImg || "/images/avatar.jpg"}
            alt="Avatar"
            className="profile-avatar"
          />
          <p><strong>Tên:</strong> {user.name}</p>
          <p><strong>SĐT:</strong> {user.phoneNumber}</p>
          <p><strong>Địa chỉ:</strong> {user.address}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <button onClick={handleEditClick}>Chỉnh sửa</button>
        </div>
      )}
    </div>
  );
};

export default Profile;
