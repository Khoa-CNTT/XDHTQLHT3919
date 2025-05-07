import React, { useEffect, useState } from 'react';
import {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory
} from '../../../services/api/adminAPI/roomCategory';
import "../../../assets/Style/admin-css/roomCategoryList.css";
import Notification from '../../../userSide/components/Other/Notification';

const RoomCategoryList = () => {
  const [roomCategories, setRoomCategories] = useState([]);
  const [form, setForm] = useState({ id: null, name: '', quantity: 0 });
  const [search, setSearch] = useState('');
  const [notification, setNotification] = useState({ message: '', show: false, type: '' });

  const fetchRoomCategories = async () => {
    try {
      const res = await getAllCategories();
      if (res.status === 200) {
        setRoomCategories(res.data);
      }
    } catch (error) {
      setNotification({ message: 'Lỗi khi lấy danh mục', show: true, type: 'error' });
      console.error('Lỗi khi lấy danh mục:', error);
    }
  };

  useEffect(() => {
    fetchRoomCategories();
  }, []);

  const handleAddOrUpdate = async () => {
    if (!form.name) {
      setNotification({ message: 'Vui lòng nhập tên danh mục', show: true, type: 'error' });
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
      setNotification({ message: form.id ? 'Cập nhật thành công!' : 'Thêm mới thành công!', show: true, type: 'success' });
    } catch (error) {
      setNotification({ message: 'Lỗi khi thêm/sửa danh mục!', show: true, type: 'error' });
      console.error(error);
    }
  };

  const handleEdit = (category) => {
    setForm({
      id: category.id,
      name: category.name,
      quantity: category.quantity ?? 0
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn chắc chắn muốn xóa?')) {
      try {
        await deleteCategory(id);
        await fetchRoomCategories();
        setNotification({ message: 'Xóa thành công!', show: true, type: 'success' });
      } catch (error) {
        setNotification({ message: 'Lỗi khi xóa!', show: true, type: 'error' });
        console.error(error);
      }
    }
  };

  // Reset form to initial state
  const handleCancel = () => {
    setForm({ id: null, name: '', quantity: 0 });
  };

  const filteredRoomCategories = roomCategories.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="main-content">
      <Notification
        message={notification.message}
        show={notification.show}
        onClose={() => setNotification({ ...notification, show: false })}
      />

      <div className="headerql">
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
          {/* Hiển thị nút hủy chỉ khi đang chỉnh sửa danh mục */}
          {form.id && (
            <button onClick={handleCancel} className="cancel-btn">
              HỦY
            </button>
          )}
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
