import axios from "axios";

const API_URL = "https://localhost:7154/api/user/register"; // Địa chỉ API cho đăng ký

export const register = async (data) => {
  try {
    const response = await axios.post(API_URL, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response; // Trả nguyên response để dùng response.status ở phía React
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    throw error;
  }
};
