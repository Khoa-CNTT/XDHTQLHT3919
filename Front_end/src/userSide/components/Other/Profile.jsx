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
    avatarFile: null, // File ảnh thật sự
  });
  const [previewAvatar, setPreviewAvatar] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setErrorMessage("Bạn chưa đăng nhập. Vui lòng đăng nhập để xem thông tin.");
      return;
    }

    userApi.getProfile(token)
      .then((res) => {
        const data = res.data.data || res.data; // xử lý cả 2 kiểu response
        setUser(data);
        setUpdatedInfo({
          fullName: data.fullName || "",
          phoneNumber: data.phoneNumber || "",
          address: data.address || "",
          avatarFile: null,
        });
        setPreviewAvatar(data.avatarUrl || "");
      })
      .catch((err) => {
        console.error("Lỗi khi lấy thông tin người dùng:", err);
        setErrorMessage("Lỗi khi lấy thông tin người dùng. Vui lòng thử lại.");
      });
  }, [token]);

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
      setUpdatedInfo((prev) => ({
        ...prev,
        avatarFile: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result);
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
      avatarFile: null,
    });
    setPreviewAvatar(user.avatarUrl || "");
  };

  const handleSaveChanges = () => {
    const formData = new FormData();
    formData.append("FullName", updatedInfo.fullName);
    formData.append("PhoneNumber", updatedInfo.phoneNumber);
    formData.append("Address", updatedInfo.address);
    if (updatedInfo.avatarFile) {
      formData.append("Avatar", updatedInfo.avatarFile);
    }

    const username = user.username || user.email || user.phoneNumber || "unknown";

    userApi.updateProfile(token, formData, username)
      .then((res) => {
        const updatedUser = res.data.data || res.data;
        setUser(updatedUser);
        setIsEditing(false);
        alert("Cập nhật thông tin thành công!");
      })
      .catch((err) => {
        console.error("Lỗi khi cập nhật thông tin:", err);
        alert("Đã xảy ra lỗi khi cập nhật thông tin.");
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
          {previewAvatar && (
            <img src={previewAvatar} alt="Avatar preview" className="profile-avatar-preview" />
          )}
          <button onClick={handleSaveChanges}>Lưu thay đổi</button>
          <button onClick={handleCancelEdit}>Hủy</button>
        </div>
      ) : (
        <div>
          <img
            src={user.avatarUrl || "/images/avatar.jpg"}
            alt="Avatar"
            className="profile-avatar"
          />
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
