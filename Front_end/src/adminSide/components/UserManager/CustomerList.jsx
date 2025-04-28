import React, { useEffect, useState } from 'react';
import { getAllCustomers, addCustomer, updateCustomer, deleteCustomer } from '../../../services/api/adminAPI/customer';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: '',
    email: '',
    address: '',
    phone: '',
    img: ''
  });
  const [loading, setLoading] = useState(false); // Trạng thái loading

  // Lấy danh sách khách hàng khi component mount
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const data = await getAllCustomers();
        setCustomers(data);
      } catch (error) {
        console.error('Lỗi khi tải danh sách khách hàng:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Thêm hoặc cập nhật khách hàng
  const handleAddOrUpdate = async () => {
    if (!form.name || !form.email || !form.phone || !form.img || !form.address) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true); // Bắt đầu loading

    try {
      if (form.id) {
        // Cập nhật khách hàng
        await updateCustomer(form.id, form);
      } else {
        // Thêm mới khách hàng
        await addCustomer(form);
      }
      // Lấy lại danh sách khách hàng
      const data = await getAllCustomers();
      setCustomers(data);
      // Reset form
      setForm({ id: null, name: '', email: '', phone: '', address: '', img: '' });
    } catch (error) {
      console.error('Lỗi khi thêm/sửa khách hàng:', error);
      alert('Đã xảy ra lỗi, vui lòng thử lại!');
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  // Chỉnh sửa thông tin khách hàng
  const handleEdit = (customer) => {
    setForm({ ...customer });
  };

  // Xóa khách hàng
  const handleDelete = async (id) => {
    if (window.confirm('Xác nhận xóa khách hàng này?')) {
      try {
        await deleteCustomer(id);
        const data = await getAllCustomers();
        setCustomers(data);
      } catch (error) {
        console.error('Lỗi khi xóa khách hàng:', error);
        alert('Đã xảy ra lỗi khi xóa khách hàng!');
      }
    }
  };

  return (
    <div className="user-container">
      <div className="user-header">
        <h1>Danh sách khách hàng</h1>
        <button className="add-btn" onClick={() => setForm({ id: null, name: '', email: '', phone: '', address: '', img: '' })}>
          THÊM KHÁCH HÀNG
        </button>
      </div>

      <div className="form-section">
        <input
          type="text"
          placeholder="Tên khách hàng"
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
          type="text"
          placeholder="Số điện thoại"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          type="text"
          placeholder="Địa chỉ"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        <input
          type="text"
          placeholder="Ảnh đại diện (URL)"
          value={form.img}
          onChange={(e) => setForm({ ...form, img: e.target.value })}
        />
        <button className="save-btn" onClick={handleAddOrUpdate}>
          {loading ? 'Đang xử lý...' : form.id ? 'Cập nhật' : 'Thêm'}
        </button>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>Ảnh</th>
            <th>Email</th>
            <th>Tên khách hàng</th>
            <th>Địa chỉ</th>
            <th>Số điện thoại</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {customers.length === 0 ? (
            <tr>
              <td colSpan="7">Không có dữ liệu khách hàng</td>
            </tr>
          ) : (
            customers.map((customer) => (
              <tr key={customer.id}>
                <td>
                  <img
                    src={customer.img}
                    alt="avatar"
                    width={40}
                    height={40}
                    style={{ borderRadius: '50%' }}
                  />
                </td>
                <td>{customer.email}</td>
                <td>{customer.name}</td>
                <td>{customer.address}</td>
                <td>{customer.phone}</td>
                <td>{new Date(customer.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(customer)}>CHỈNH SỬA</button>
                  <button className="delete-btn" onClick={() => handleDelete(customer.id)}>XÓA</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerList;
