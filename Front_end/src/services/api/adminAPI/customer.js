let mockCustomers = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'a@example.com',
    address: 'Hà Nội',
    phone: '0987654321',
    img: 'https://via.placeholder.com/40',
    createdAt: '2024-01-01T12:00:00Z',
  },
  {
    id: 2,
    name: 'Trần Thị B',
    email: 'b@example.com',
    address: 'Hồ Chí Minh',
    phone: '0981234567',
    img: 'https://via.placeholder.com/40',
    createdAt: '2024-02-01T14:00:00Z',
  },
];

export const getAllCustomers = async () => {
  // Giả lập lấy tất cả khách hàng từ API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCustomers);
    }, 500); // Giả lập độ trễ
  });
};

export const addCustomer = async (newCustomer) => {
  // Giả lập thêm khách hàng mới
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      newCustomer.id = Date.now();
      newCustomer.createdAt = new Date().toISOString();
      mockCustomers.push(newCustomer);
      resolve(newCustomer);
    }, 500); // Giả lập độ trễ
  });
};

export const updateCustomer = async (id, updatedCustomer) => {
  // Giả lập cập nhật thông tin khách hàng
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockCustomers.findIndex(customer => customer.id === id);
      if (index !== -1) {
        mockCustomers[index] = { ...mockCustomers[index], ...updatedCustomer };
        resolve(mockCustomers[index]);
      } else {
        reject('Customer not found');
      }
    }, 500); // Giả lập độ trễ
  });
};

export const deleteCustomer = async (id) => {
  // Giả lập xóa khách hàng
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      mockCustomers = mockCustomers.filter(customer => customer.id !== id);
      resolve(true);
    }, 500); // Giả lập độ trễ
  });
};
