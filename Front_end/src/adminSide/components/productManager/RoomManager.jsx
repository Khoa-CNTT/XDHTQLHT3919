import React, { useEffect, useState } from 'react';
import {
  getRooms,
  addRoom,
  updateRoom,
  deleteRoom,
} from '../../../services/api/adminAPI/roomAPI';
import { getAllCategories } from '../../../services/api/adminAPI/roomcategoryAPI';
import { getAllAmenities } from '../../../services/api/userAPI/amenityAPI';
import Notification from '../../../userSide/components/Other/Notification';
import "../../../assets/Style/admin-css/roomList.css";

const RoomManager = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: '',
    price: '',
    idCategory: '',
    pathImg: '',
    detail: '',
    status: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [search, setSearch] = useState('');
  const [notification, setNotification] = useState({ show: false, message: "", type: "info" });
  const [isAmenitiesVisible, setIsAmenitiesVisible] = useState(false);

  const showNotification = (message, type = "info") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "info" });
    }, 3000);
  };

  useEffect(() => {
    fetchRoomData();
    fetchRoomTypes();
    fetchAmenities();
  }, []);

  const fetchRoomData = async () => {
    try {
      const res = await getRooms();
      setRooms(res);
    } catch (error) {
      console.error(error);
      showNotification('Không thể tải danh sách phòng', "error");
    }
  };

  const fetchRoomTypes = async () => {
    try {
      const res = await getAllCategories();
      setRoomTypes(res.data);
    } catch (error) {
      console.error('Lỗi khi tải loại phòng:', error);
      showNotification('Lỗi khi tải loại phòng', "error");
    }
  };

  const fetchAmenities = async () => {
    try {
      const res = await getAllAmenities();
      setAmenities(res.data);
    } catch (error) {
      console.error('Lỗi khi tải tiện nghi:', error);
      showNotification('Lỗi khi tải tiện nghi', "error");
    }
  };

  // Hàm upload ảnh lên server
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('https://localhost:7154/api/room/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    return data.fileUrl; // Lấy đúng trường fileUrl mà backend trả về
  };

  const handleAddOrUpdate = async () => {
    if (!form.name || !form.price) {
      showNotification('Vui lòng nhập đầy đủ thông tin bắt buộc', "error");
      return;
    }

    let imagePath = form.pathImg;
    if (imageFile) {
      try {
        imagePath = await uploadImage(imageFile); // imagePath là fileUrl, ví dụ: /images/others/abc.jpg
      } catch (error) {
        showNotification('Lỗi upload ảnh', "error");
        return;
      }
    }

    const room = {
      name: form.name,
      price: +form.price,
      idCategory: form.idCategory,
      pathImg: imagePath,
      detail: form.detail,
      status: form.status,
      amenityIds: selectedAmenities
    };

    try {
      if (form.id) {
        await updateRoom({ ...room, id: form.id });
        showNotification("Cập nhật phòng thành công", "success");
      } else {
        await addRoom(room);
        showNotification("Thêm phòng thành công", "success");
      }

      await fetchRoomData();
      setForm({ id: null, name: '', price: '', idCategory: '', pathImg: '', detail: '', status: '' });
      setImageFile(null);
      setSelectedAmenities([]);
    } catch (error) {
  const message =
    error?.response?.data?.message ||
    error.message ||
    "Có lỗi khi lưu phòng!";
  console.error("Lỗi khi lưu phòng:", error);
  showNotification(message, "error");
}
  };

  const handleEdit = (room) => {
    setForm({
      id: room.id,
      name: room.name,
      price: room.price,
      idCategory: room.idCategory,
      pathImg: room.pathImg,
      detail: room.detail || '',
      status: room.status || ''
    });
    setImageFile(null);
    setSelectedAmenities((room.amenities || []).map(a => a.id));
  };

const handleDelete = async (id) => {
  // Kiểm tra id hợp lệ (UUID)
  if (!id || typeof id !== 'string' || id.length < 10) {
    showNotification('ID phòng không hợp lệ!', "error");
    console.error('ID phòng không hợp lệ:', id);
    return;
  }
  console.log('Xóa phòng với id:', id);

  // Log endpoint thực tế sẽ gọi
  const endpoint = `https://localhost:7154/api/room/${id}`;
  console.log('Endpoint gọi xóa:', endpoint);

  if (window.confirm('Bạn có chắc chắn muốn xóa phòng này không?')) {
    try {
      await deleteRoom(id);
      await fetchRoomData();
      showNotification("Xóa phòng thành công", "success");
    } catch (error) {
      // Hiển thị thông báo chi tiết từ backend nếu có
      const message = error?.response?.data?.message || error.message || 'Không thể xóa phòng';
      showNotification(message, "error");
      console.error('Lỗi khi xóa phòng:', error);
    }
  }
};

  const handleAmenityChange = (amenityId) => {
    setSelectedAmenities((prevSelected) => {
      if (prevSelected.includes(amenityId)) {
        return prevSelected.filter((id) => id !== amenityId);
      } else {
        return [...prevSelected, amenityId];
      }
    });
  };

  const toggleAmenitiesVisibility = () => {
    setIsAmenitiesVisible(!isAmenitiesVisible);
  };

  const handleCancel = () => {
    setForm({ id: null, name: '', price: '', idCategory: '', pathImg: '', detail: '', status: '' });
    setImageFile(null);
    setSelectedAmenities([]);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setForm((prev) => ({ ...prev, pathImg: file ? file.name : '' }));
  };

  const filteredRooms = Array.isArray(rooms)
    ? rooms.filter(room => room.name?.toLowerCase().includes(search.toLowerCase()))
    : [];

  return (
    <div className="main-content">
      <div className="headerql">
        <h1>Danh sách phòng</h1>
        <div className="actions">
          <input
            type="text"
            placeholder="Nhập phòng bạn muốn tìm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={handleAddOrUpdate}>
            {form.id ? 'CẬP NHẬT' : 'THÊM PHÒNG'}
          </button>
          {form.id && (
            <button onClick={handleCancel} className="cancel-button">
              HỦY
            </button>
          )}
        </div>
      </div>

      <div className="form-secction">
        <input
          type="text"
          placeholder="Tên phòng"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Giá phòng"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <select
          value={form.idCategory}
          onChange={(e) => setForm({ ...form, idCategory: e.target.value })}
        >
          <option value="">-- Chọn loại phòng --</option>
          {roomTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        <input
          type="text"
          placeholder="Tên file ảnh"
          value={form.pathImg}
          readOnly
        />
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="">-- Trạng thái phòng --</option>
          <option value="Còn trống">Còn trống</option>
          <option value="Đã đặt">Đã đặt</option>
          <option value="Đang bảo trì">Đang bảo trì</option>
        </select>

        <textarea
          className='tera'
          placeholder="Mô tả phòng"
          value={form.detail}
          onChange={(e) => setForm({ ...form, detail: e.target.value })}
        ></textarea>

        <div className="amenity-selection">
          <h3>Chọn tiện nghi cho phòng</h3>
          <button onClick={toggleAmenitiesVisibility}>
            {isAmenitiesVisible ? 'Ẩn tiện nghi' : 'Hiển thị tiện nghi'}
          </button>
          {isAmenitiesVisible && (
            <div className="amenity-lisst">
              {amenities.map((amenity) => (
                <div key={amenity.id} className="amenity-option">
                  <input
                    className='roomlisst-sellect'
                    type="checkbox"
                    id={amenity.id}
                    checked={selectedAmenities.includes(amenity.id)}
                    onChange={() => handleAmenityChange(amenity.id)}
                  />
                  <label htmlFor={amenity.id}>{amenity.name}</label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th>Hình ảnh</th>
            <th>Số phòng</th>
            <th>Loại</th>
            <th>Giá</th>
            <th>Chi tiết</th>
            <th>Trạng thái</th>
            <th>Tiện nghi</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredRooms.map((room) => (
            <tr key={room.id}>
              <td>
                <img
                  src={
                    room.pathImg
                      ? room.pathImg.startsWith('http')
                        ? room.pathImg
                        : `https://localhost:7154${room.pathImg}`
                      : '/default-room.jpg'
                  }
                  alt="ảnh phòng"
                  style={{ width: 50 }}
                />
              </td>
              <td>{room.name}</td>
              <td>{room.categoryName}</td>
              <td>{(+room.price).toLocaleString()} đ</td>
              <td>{room.detail}</td>
              <td>{room.status || "Chưa cập nhật"}</td>
              <td>
                {(room.amenities || []).map(a => a.name).join(", ")}
              </td>
              <td>
                <button className='edit-btn' onClick={() => handleEdit(room)}>CHỈNH SỬA</button>
                <button className='delete-btn' onClick={() => handleDelete(room.id)}>XÓA</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Notification
        message={notification.message}
        show={notification.show}
        type={notification.type}
      />
    </div>
  );
};

export default RoomManager;