import axios from 'axios';

const API_BASE = 'https://localhost:7154/api/category';

export const getAllCategories = async () => {
  const res = await axios.get(`${API_BASE}/all`);
  return res.data;
};
export const getCategoryById = async (id) => {
  const res = await axios.get(`${API_BASE}/${id}`);
  return res.data;
};

export const addCategory = async (category) => {
  const res = await axios.post(`${API_BASE}/add`, category);
  return res.data;
};

export const updateCategory = async (category) => {
  const res = await axios.put(`${API_BASE}/edit`, category);
  return res.data;
};

export const deleteCategory = async (id) => {
  const res = await axios.delete(`${API_BASE}/delete/${id}`);
  return res.data;
};



