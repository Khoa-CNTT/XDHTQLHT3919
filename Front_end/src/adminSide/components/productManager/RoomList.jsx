import React, { useEffect, useState } from 'react';
import {
  getRooms,
  addRoom,
  updateRoom,
  deleteRoom,
} from '../../../services/api/adminAPI/productApi';
import { getAllCategories } from '../../../services/api/adminAPI/roomCategory'; 
import "../../../assets/Style/admin-css/productList.css";

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

  useEffect(() => {
    fetchRoomData();
    fetchRoomTypes(); // Gọi API lấy danh sách loại phòng
  }, []);

  const fetchRoomData = async () => {
    try {
      const res = await getRooms();
      setRooms(res);
    } catch (error) {
      alert('Không thể tải danh sách phòng');
      console.error(error);
    }
  };

  const fetchRoomTypes = async () => {
    try {
      const res = await getAllCategories();  // Lấy danh sách loại phòng
      setRoomTypes(res.data); // Gán kết quả vào state roomTypes
    } catch (error) {
      console.error('Lỗi khi tải loại phòng:', error);
    }
  };

  const handleAddOrUpdate = async () => {
    if (!form.name || !form.price || !form.pathImg) {
      alert('Vui lòng nhập đầy đủ thông tin bắt buộc');
      return;
    }

    const room = {
      name: form.name,
      price: +form.price,
      idCategory: form.type,
      pathImg: form.pathImg,
      detail: form.detail,
    };

    try {
      if (form.id) {
        await updateRoom({ ...room, id: form.id });
      } else {
        await addRoom(room);
      }

      await fetchRoomData();
      setForm({ id: null, name: '', price: '', idCategory: '', pathImg: '', detail: '' });
    } catch (error) {
      console.error("Lỗi khi lưu phòng:", error);
      alert("Có lỗi khi lưu phòng!");
    }
  };

  const handleEdit = (room) => {
    setForm({
      id: room.id,
      name: room.name,
      price: room.price,
      idCategory: room.type,
      pathImg: room.pathImg,
      detail: room.detail || ''
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phòng này không?')) {
      try {
        await deleteRoom(id);
        await fetchRoomData();
      } catch (error) {
        alert('Không thể xóa phòng');
      }
    }
  };

  const filteredRooms = Array.isArray(rooms)
    ? rooms.filter(room => room.name?.toLowerCase().includes(search.toLowerCase()))
    : [];

  return (
    <div className="main-content">
      <div className="header">
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
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
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
            <th>Ghi chú</th>
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
    </div>
  );
};

export default RoomList;