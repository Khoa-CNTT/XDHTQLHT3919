import React, { useEffect, useState } from 'react';
import {
  getRooms,
  addRoom,
  updateRoom,
  deleteRoom,
} from '../../../services/api/adminAPI/productApi';
import { getAllCategories } from '../../../services/api/adminAPI/roomCategory';
import Notification from '../../../userSide/components/Other/Notification';
import "../../../assets/Style/admin-css/roomList.css";

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: '',
    price: '',
    idCategory: '',
    pathImg: '',
    detail: ''
  });
  const [search, setSearch] = useState('');

  const [notification, setNotification] = useState({ show: false, message: "", type: "info" });

  const showNotification = (message, type = "info") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "info" });
    }, 3000);
  };

  useEffect(() => {
    fetchRoomData();
    fetchRoomTypes();
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

  const handleAddOrUpdate = async () => {
    if (!form.name || !form.price || !form.pathImg) {
      showNotification('Vui lòng nhập đầy đủ thông tin bắt buộc', "error");
      return;
    }

    const room = {
      name: form.name,
      price: +form.price,
      idCategory: form.idCategory,
      pathImg: form.pathImg,
      detail: form.detail,
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
      setForm({ id: null, name: '', price: '', idCategory: '', pathImg: '', detail: '' });
    } catch (error) {
      console.error("Lỗi khi lưu phòng:", error);
      showNotification("Có lỗi khi lưu phòng!", "error");
    }
  };

  const handleEdit = (room) => {
    setForm({
      id: room.id,
      name: room.name,
      price: room.price,
      idCategory: room.idCategory,
      pathImg: room.pathImg,
      detail: room.detail || ''
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phòng này không?')) {
      try {
        await deleteRoom(id);
        await fetchRoomData();
        showNotification("Xóa phòng thành công", "success");
      } catch (error) {
        console.error(error);
        showNotification('Không thể xóa phòng', "error");
      }
    }
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
        </div>
      </div>

      <div className="form-section">
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
          type="text"
          placeholder="URL ảnh phòng"
          value={form.pathImg}
          onChange={(e) => setForm({ ...form, pathImg: e.target.value })}
        />
        <textarea
          placeholder="Mô tả phòng"
          value={form.detail}
          onChange={(e) => setForm({ ...form, detail: e.target.value })}
        ></textarea>
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th>Hình ảnh</th>
            <th>Mã phòng</th>
            <th>Loại</th>
            <th>Giá</th>
            <th>Chi tiết</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredRooms.map((room) => (
            <tr key={room.id}>
              <td><img src={room.pathImg} alt="ảnh phòng" style={{ width: 50 }} /></td>
              <td>{room.name}</td>
              <td>{room.categoryName}</td>
              <td>{(+room.price).toLocaleString()} đ</td>
              <td>{room.detail}</td>
              <td>
                <button onClick={() => handleEdit(room)}>CHỈNH SỬA</button>
                <button onClick={() => handleDelete(room.id)}>XÓA</button>
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

export default RoomList;
