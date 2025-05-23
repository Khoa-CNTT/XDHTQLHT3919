import axios from "axios";

const BASE_URL = "https://localhost:7154/api/user";

// ========== 1. Đăng nhập ========== 
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, {
      EmailOrPhone: credentials.userLogin, // phải viết hoa đúng như trong BE
      Password: credentials.password,
    });

    if (response.status === 200 && response.data.token) {
      return response.data;
    } else {
      throw new Error("Đăng nhập thất bại. Không nhận được token.");
    }
  } catch (error) {
    console.error("Lỗi đăng nhập:", error.response?.data || error.message);
    throw error;
  }
};


// ========== 2. Cập nhật thông tin người dùng ========== 
export const updateProfile = async (updatedData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Không có token, vui lòng đăng nhập lại.");
    
    // Thêm id người dùng vào updatedData nếu cần
    const userId = localStorage.getItem("id");
    if (!userId) throw new Error("Không tìm thấy ID người dùng.");

    const response = await axios.put(`${BASE_URL}/edit/${userId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Lỗi khi cập nhật thông tin:", error.response.data);
    } else if (error.request) {
      console.error("Không nhận được phản hồi khi cập nhật:", error.request);
    } else {
      console.error("Lỗi khác khi cập nhật thông tin:", error.message);
    }
    throw error;
  }
};

// ========== 3. Xóa người dùng ========== 
export const deleteUser = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Không có token, vui lòng đăng nhập lại.");
    
    const userId = localStorage.getItem("id");
    if (!userId) throw new Error("Không tìm thấy ID người dùng.");

    const response = await axios.delete(`${BASE_URL}/delete/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Lỗi khi xóa người dùng:", error.response.data);
    } else if (error.request) {
      console.error("Không nhận được phản hồi khi xóa người dùng:", error.request);
    } else {
      console.error("Lỗi khác khi xóa người dùng:", error.message);
    }
    throw error;
  }
};
