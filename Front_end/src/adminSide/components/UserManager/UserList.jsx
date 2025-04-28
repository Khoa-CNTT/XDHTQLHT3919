import React, { useEffect, useState } from 'react';
import userApi from '../../../services/api/AuthAPI/user';
import roleApi from '../../../services/api/AuthAPI/roleApi'; 
import "../../../assets/Style/admin-css/userList.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'user',
    phone: '',
    img: '',
  });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditMode, setIsEditMode] = useState(false); // Thêm trạng thái: đang thêm hay đang sửa

  const resetForm = () => {
    setForm({
      id: null,
      name: '',
      email: '',
      password: '',
      address: '',
      role: 'user',
      phone: '',
      img: '',
    });
    setIsEditMode(false); // Reset về chế độ thêm
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userApi.getAllUsers();
      if (Array.isArray(response)) {
        const formatted = response.map(u => ({
          ...u,
          createdAt: u.createAt,
          img: u.pathImg
        }));
        setUsers(formatted);
      } else {
        setError('Dữ liệu không đúng định dạng');
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách người dùng:', error);
      setError('Lỗi khi lấy danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await roleApi.getAllRoles();
      if (Array.isArray(response)) {
        setRoles(response);
      } else {
        setError('Lỗi khi lấy danh sách vai trò');
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách vai trò:', error);
      setError('Lỗi khi lấy danh sách vai trò');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const handleAddOrUpdate = async () => {
    // Kiểm tra form trước khi gửi
    if (!form.name || (!form.email && !form.phone) || (!isEditMode && !form.password)) {
      alert('Vui lòng nhập đầy đủ tên, email/điện thoại và mật khẩu (nếu thêm mới)');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^[0-9]{10,11}$/;

    if (form.email && !emailRegex.test(form.email)) {
      alert('Email không hợp lệ');
      return;
    }
    if (form.phone && !phoneRegex.test(form.phone)) {
      alert('Số điện thoại không hợp lệ');
      return;
    }

    const userPayload = {
      id: form.id, // Nếu đang sửa thì gửi id
      name: form.name,
      email: form.email,
      password: form.password, // Mật khẩu chỉ cần khi thêm mới
      address: form.address,
      phone: form.phone,
      pathImg: form.img,
    };
    
    setLoading(true);
    try {
      if (isEditMode) {
        // Nếu đang sửa
        await userApi.updateUser(userPayload);
        alert('Cập nhật thành công!');
      } else {
        // Nếu đang thêm mới
        await userApi.addUser(userPayload);
        alert('Thêm mới thành công!');
      }
      await fetchUsers();
      resetForm();
    } catch (error) {
      console.error('Lỗi khi thêm/sửa người dùng:', error);
      alert('Đã xảy ra lỗi, vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setForm({
      id: user.id,
      name: user.name,
      email: user.email,
      password: '', // Mật khẩu để trống
      address: user.address,
      phone: user.phone,
      img: user.img,
      role: user.nameRole === "Admin" ? "admin" : "user"
    });
    setIsEditMode(true); // Đang chỉnh sửa
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
      try {
        await userApi.deleteUser(id);
        await fetchUsers();
      } catch (error) {
        console.error('Lỗi khi xóa người dùng:', error);
        alert('Đã xảy ra lỗi khi xóa!');
      }
    }
  };

  const filteredUsers = users.filter(u => {
    const query = search.trim().toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(query)) ||
      (u.email && u.email.toLowerCase().includes(query))
    );
  });

  return (
    <div className="user-container">
      <div className="user-header">
        <h1>Danh sách tài khoản</h1>
        <div className="actions">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="add-btn" onClick={handleAddOrUpdate}>
            {loading ? 'Đang xử lý...' : isEditMode ? 'Cập nhật' : 'Thêm mới'}
          </button>
          {isEditMode && (
            <button className="cancel-btn" onClick={resetForm}>
              Hủy
            </button>
          )}
        </div>
      </div>

      <div className="form-section">
        <input
          type="text"
          placeholder="Tên"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <input
          type="text"
          placeholder="Địa chỉ"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        <input
          type="text"
          placeholder="Số điện thoại"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          type="text"
          placeholder="Ảnh đại diện (link)"
          value={form.img}
          onChange={(e) => setForm({ ...form, img: e.target.value })}
        />

        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          {roles.map(role => (
            <option key={role.id} value={role.name}>
              {role.name}
            </option>
          ))}
        </select>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>Ảnh</th>
            <th>Email</th>
            <th>Tên</th>
            <th>Địa chỉ</th>
            <th>Vai trò</th>
            <th>Điện thoại</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length === 0 ? (
            <tr><td colSpan="8">Không có dữ liệu</td></tr>
          ) : (
            filteredUsers.map(user => (
              <tr key={user.id}>
                <td>
                  <img
                    src={user.img || 'https://via.placeholder.com/40'}
                    alt="avatar"
                    style={{ width: 40, height: 40, borderRadius: '50%' }}
                  />
                </td>
                <td>{user.email}</td>
                <td>{user.name}</td>
                <td>{user.address}</td>
                <td>{user.nameRole || 'User'}</td>
                <td>{user.phone}</td>
                <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(user)}>Chỉnh sửa</button>
                  <button className="delete-btn" onClick={() => handleDelete(user.id)}>Xóa</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
