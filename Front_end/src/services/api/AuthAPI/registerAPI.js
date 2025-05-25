import axios from "axios";

const API_URL = "https://localhost:7154/api/user/register2";

export const register = async ({ name, email, phone, password, address, idRole }) => {
  try {
    const payload = {
      name: name?.trim() || "",
      password: password?.trim(),
      idRole,
    };

    if (email) {
      payload.email = email.trim();
    }

    if (phone) {
      payload.phone = phone.trim();
    }

    if (address) {
      payload.address = address.trim();
    }

    if (!payload.email && !payload.phone) {
      throw new Error("Vui lòng nhập ít nhất email hoặc số điện thoại");
    }

    if (!payload.password) {
      throw new Error("Mật khẩu không được để trống");
    }

    const response = await axios.post(API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi đăng ký:", error.response?.data || error.message);
    console.error("Chi tiết lỗi:", error.response?.data?.errors);
    throw error;
  }
};
