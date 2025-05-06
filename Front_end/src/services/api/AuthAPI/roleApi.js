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

const getRoleById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}?id=${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching role by ID:', error);
    throw error;
  }
};

const addRole = async (role) => {
  try {
    const response = await axios.post(`${API_URL}/add`, role);
    return response.data;
  } catch (error) {
    console.error('Error adding role:', error);
    throw error;
  }
};

const updateRole = async (role) => {
  try {
    const response = await axios.put(`${API_URL}/edit`, role);
    return response.data;
  } catch (error) {
    console.error('Error updating role:', error);
    throw error;
  }
};

const deleteRole = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/delete`, {
      data: id,
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting role:', error);
    throw error;
  }
};

const roleApi = {
  getAllRoles,
  getRoleById,
  addRole,
  updateRole,
  deleteRole,
};

export default roleApi;
