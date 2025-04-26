import React, { useEffect, useState } from 'react';
import {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory
} from '../../../services/api/adminAPI/roomCategory';
import "../../../assets/Style/admin-css/roomCategoryList.css"


const RoomCategoryList = () => {
  const [roomCategories, setRoomCategories] = useState([]);
  const [form, setForm] = useState({ id: null, name: '', quantity: 0 });
  const [search, setSearch] = useState('');

  const fetchRoomCategories = async () => {
    try {
      const res = await getAllCategories();
      if (res.status === 200) {
        setRoomCategories(res.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh mục:', error);
    }
  };

  useEffect(() => {
    fetchRoomCategories();
  }, []);

  const handleAddOrUpdate = async () => {
    if (!form.name) {
      alert('Vui lòng nhập tên danh mục');
      return;
    }

    const newCategory = {
      id: form.id || crypto.randomUUID(),
      name: form.name,
      quantity: parseInt(form.quantity) || 0
    };

    try {
      if (form.id) {
        await updateCategory(newCategory);
      } else {
        await addCategory(newCategory);
      }
      await fetchRoomCategories();
      setForm({ id: null, name: '', quantity: 0 });
    } catch (error) {
      alert('Lỗi khi thêm/sửa danh mục!');
      console.error(error);
    }
  };

  const handleEdit = (room) => {
    setForm({
      id: room.id,
      name: room.name,
      quantity: room.quantity ?? 0
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn chắc chắn muốn xóa?')) {
      try {
        await deleteCategory(id);
        await fetchRoomCategories();
      } catch (error) {
        alert('Lỗi khi xóa!');
        console.error(error);
      }
    }
  };

  const filteredRoomCategories = roomCategories.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="main-content">
      <div className="header">
        <h1>Danh mục phòng</h1>
        <div className="actions">
          <input
            type="text"
            placeholder="Tìm danh mục..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="add-btn"
            onClick={handleAddOrUpdate}
          >
            {form.id ? 'Cập nhật' : 'Thêm'}
          </button>
        </div>
      </div>

      <div className="form-section">
        <input
          type="text"
          placeholder="Tên danh mục"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Số lượng"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          min="0"
        />
      </div>

      <table className="room-table">
        <thead>
          <tr>
            <th>Tên danh mục</th>
            <th>Số lượng</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredRoomCategories.map((room) => (
            <tr key={room.id}>
              <td>{room.name}</td>
              <td>{room.quantity ?? 0}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(room)}>
                  CHỈNH SỬA
                </button>
                <button className="delete-btn" onClick={() => handleDelete(room.id)}>
                  XÓA
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoomCategoryList;
