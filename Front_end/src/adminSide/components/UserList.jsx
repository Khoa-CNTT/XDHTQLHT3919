import React, { useEffect, useState } from 'react';

import { getAllUsers } from '../../services/api/AuthAPI/User';


const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error('Lỗi khi tải danh sách người dùng:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="user-container">
      <div className="user-header">
        <h1>Danh sách tài khoản</h1>
        <button className="add-btn">THÊM TÀI KHOẢN</button>
      </div>
      <table className="user-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Email</th>
            <th>Tên tài khoản</th>
            <th>Địa chỉ</th>
            <th>Vai trò</th>
            <th>Số điện thoại</th>
            <th>Ngày tạo</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="6">Không có dữ liệu người dùng</td>
            </tr>
          ) : (
            users.map((user, i) => (
              <tr key={i}>
                <td>{user.img}</td>
                <td>{user.email}</td>
                <td>{user.name}</td>
                <td>{user.address}</td>
                <td>{user.role}</td>
                <td>{user.phone}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
