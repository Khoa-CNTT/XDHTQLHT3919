import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userApi from "../../../services/api/user";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedInfo, setUpdatedInfo] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    avatarUrl: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMessage("Bạn chưa đăng nhập. Vui lòng đăng nhập để xem thông tin.");
      return;
    }

    userApi.getProfile(token)
      .then((res) => {
        setUser(res.data);
        setUpdatedInfo({
          fullName: res.data.fullName || "",
          phoneNumber: res.data.phoneNumber || "",
          address: res.data.address || "",
          avatarUrl: res.data.avatarUrl || "",
        });
      })
      .catch((err) => {
        console.error("Lỗi khi lấy thông tin người dùng:", err);
        setErrorMessage("Lỗi khi lấy thông tin người dùng. Vui lòng thử lại.");
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUpdatedInfo((prev) => ({
          ...prev,
          avatarUrl: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = () => setIsEditing(true);
  const handleCancelEdit = () => {
    setIsEditing(false);
    setUpdatedInfo({
      fullName: user.fullName || "",
      phoneNumber: user.phoneNumber || "",
      address: user.address || "",
      avatarUrl: user.avatarUrl || "",
    });
  };

  const handleSaveChanges = () => {
    const token = localStorage.getItem("token");
    userApi.updateProfile(token, updatedInfo)
      .then((res) => {
        setUser(res.data);
        setIsEditing(false);
      })
      .catch((err) => {
        console.error("Lỗi khi cập nhật thông tin:", err);
      });
  };

  if (errorMessage) return <div>{errorMessage}</div>;
  if (!user) return <div>Đang tải thông tin...</div>;

  return (
    <div className="profile-container">
      <h2>Thông tin tài khoản</h2>
      {isEditing ? (
        <div>
          <label>Tên:</label>
          <input name="fullName" value={updatedInfo.fullName} onChange={handleInputChange} />
          <label>Số điện thoại:</label>
          <input name="phoneNumber" value={updatedInfo.phoneNumber} onChange={handleInputChange} />
          <label>Địa chỉ:</label>
          <input name="address" value={updatedInfo.address} onChange={handleInputChange} />
          <label>Ảnh đại diện:</label>
          <input type="file" onChange={handleFileChange} />
          {updatedInfo.avatarUrl && <img src={updatedInfo.avatarUrl} alt="Avatar" className="profile-avatar-preview" />}
          <button onClick={handleSaveChanges}>Lưu thay đổi</button>
          <button onClick={handleCancelEdit}>Hủy</button>
        </div>
      ) : (
        <div>
          <img src={user.avatarUrl || "/images/default-avatar.jpg"} alt="Avatar" className="profile-avatar" />
          <p><strong>Tên:</strong> {user.fullName || "Chưa có thông tin"}</p>
          <p><strong>SĐT:</strong> {user.phoneNumber || "Chưa có thông tin"}</p>
          <p><strong>Địa chỉ:</strong> {user.address || "Chưa có thông tin"}</p>
          <button onClick={handleEditClick}>Chỉnh sửa</button>
        </div>
      )}
    </div>
  );
};

export default Profile;
