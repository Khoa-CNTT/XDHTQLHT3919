import React, { useEffect, useState } from 'react';
import userApi from '../../../services/api/AuthAPI/user';
import "../../../assets/Style/admin-css/userList.css";

const UserList = () => {
  const [users, setUsers] = useState([]);  // Dữ liệu người dùng
  const [form, setForm] = useState({
    id: null,
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'user',
    phone: '',
    img: '',
    createdAt: ''
  });
  const [search, setSearch] = useState('');  // Tìm kiếm người dùng
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      createdAt: ''
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await userApi.getAllUsers();
        console.log('Fetched Users:', response);

        // Vì response là mảng -> dùng trực tiếp
        if (Array.isArray(response)) {
          setUsers(response);
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

    fetchData();
  }, []);


  // Log trạng thái của 'users' sau khi dữ liệu được tải
  useEffect(() => {
    console.log('Users State:', users); // Kiểm tra xem users đã được cập nhật hay chưa
  }, [users]);

  const handleAddOrUpdate = async () => {
    if (!form.name || !form.password || !form.address || !form.img || !form.createdAt) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^[0-9]{10,11}$/;

    if (!form.email.trim() && !form.phone.trim()) {
      alert('Vui lòng nhập Email hoặc Số điện thoại');
      return;
    }

    if (form.email.trim() && !emailRegex.test(form.email)) {
      alert('Email không hợp lệ');
      return;
    }

    if (form.phone.trim() && !phoneRegex.test(form.phone)) {
      alert('Số điện thoại không hợp lệ');
      return;
    }

    const newUser = { ...form };

    setLoading(true);
    try {
      if (form.id) {
        await userApi.updateUser(form.id, newUser);  // Cập nhật thông tin người dùng
      } else {
        await userApi.addUser(newUser);  // Thêm người dùng mới
      }
      const data = await userApi.getAllUsers();
      console.log('Users after Add/Update:', data);  // Log danh sách người dùng sau khi thêm/sửa
      setUsers(data.data); // Cập nhật lại danh sách người dùng sau khi thêm/sửa
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
      ...user,
      createdAt: user.createdAt ? user.createdAt.split('T')[0] : '',  // Chuyển đổi thời gian thành định dạng ngày
      password: ''  // Để trống password khi chỉnh sửa
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Xác nhận xóa tài khoản này?')) {
      try {
        // Gọi hàm xóa người dùng với id đúng
        await userApi.deleteUser(id);  // Sử dụng id đúng
        const data = await userApi.getAllUsers();
        console.log('Users after Delete:', data);  // Log danh sách người dùng sau khi xóa
        setUsers(data.data); // Cập nhật lại danh sách người dùng sau khi xóa
      } catch (error) {
        console.error('Lỗi khi xóa người dùng:', error);
        alert('Đã xảy ra lỗi khi xóa người dùng!');
      }
    }
  };
  

  const filteredUsers = users.filter(u => {
    const normalizedSearch = search.trim().toLowerCase();  // Normalize từ khóa tìm kiếm

    const userName = u.name ? u.name.toLowerCase() : '';  // Normalize tên người dùng
    const userEmail = u.email ? u.email.toLowerCase() : '';  // Normalize email người dùng

    const matchesSearch = normalizedSearch === '' ||
      userName.includes(normalizedSearch) ||
      userEmail.includes(normalizedSearch);

    return matchesSearch;
  });

  console.log('Filtered Users:', filteredUsers);  // Log danh sách người dùng sau khi lọc

  return (
    <div className="user-container">
      <div className="user-header">
        <h1>Danh sách tài khoản</h1>
        <div className="actions">
          <input
            type="text"
            placeholder="Tìm tài khoản..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="add-btn" onClick={handleAddOrUpdate}>
            {loading ? 'Đang xử lý...' : form.id ? 'Cập nhật' : 'Thêm'}
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="form-section">
        <input
          type="text"
          placeholder="Tên tài khoản"
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
          placeholder="Ảnh đại diện (URL)"
          value={form.img}
          onChange={(e) => setForm({ ...form, img: e.target.value })}
        />
        <input
          type="date"
          value={form.createdAt}
          onChange={(e) => setForm({ ...form, createdAt: e.target.value })}
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="user">Người dùng</option>
          <option value="admin">Quản trị viên</option>
        </select>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>Ảnh</th>
            <th>Email</th>
            <th>Tên tài khoản</th>
            <th>Địa chỉ</th>
            <th>Vai trò</th>
            <th>Số điện thoại</th>
            <th>Thời gian tạo</th>
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
                    src={user.pathImg || 'https://via.placeholder.com/40'}
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
                  <button className="edit-btn" onClick={() => handleEdit(user)}>
                    CHỈNH SỬA
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(user.id)}>
                    XÓA
                  </button>
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
