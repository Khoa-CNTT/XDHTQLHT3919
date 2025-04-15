import axios from 'axios';

// URL của API backend
const API_URL = "http://your-backend-url/api/auth/reset-password";

export const resetPassword = async (email, phoneNumber, newPassword) => {
  try {
    const response = await axios.post(API_URL, {
      email,
      phoneNumber,
      newPassword,
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi API:", error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};
