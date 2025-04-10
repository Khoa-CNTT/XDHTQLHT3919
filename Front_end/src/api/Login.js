import axios from "axios";

const API_URL = "https://localhost:7154/api/user/login";

export const login = async (credentials) => {
  try {
    const response = await axios.post(API_URL, credentials);
    return response.data;
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    throw error;
  }
};
