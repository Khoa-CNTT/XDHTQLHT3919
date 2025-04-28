// src/services/api/AuthAPI/roleApi.js

import axios from 'axios';

const API_URL = 'https://localhost:7154/api/role';

const getAllRoles = async () => {
  try {
    const response = await axios.get(`${API_URL}/all`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};
const roleApi = {
    getAllRoles,
  };

export default roleApi;