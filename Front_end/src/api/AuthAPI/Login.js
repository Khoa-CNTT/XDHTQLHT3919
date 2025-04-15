// import axios from "axios";
// import "./axiosInstance.js"

// const API_URL = "https://localhost:7154/api/user/login";

// export const login = async (credentials) => {
//   try {
//     const response = await axios.post(API_URL, credentials);
//     return response.data;
//   } catch (error) {
//     console.error("Lỗi đăng nhập:", error);
//     throw error;
//   }
// };
import axiosInstance from "../axiosInstance";

const API_URL = "/api/user/login";

export const login = async (credentials) => {
  try {
    const response = await axiosInstance.post(API_URL, credentials);
    return response.data;
  } catch (error) {
    console.error("Lỗi đăng nhập:", error.response ? error.response.data : error.message);
    throw error;
  }
};

