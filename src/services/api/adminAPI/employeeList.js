import axios from 'axios';

const API_URL = 'http://localhost:3001/employees';

export const getAllEmployees = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const addEmployee = async (emp) => {
  const res = await axios.post(API_URL, emp);
  return res.data;
};

export const updateEmployee = async (id, emp) => {
  const res = await axios.put(`${API_URL}/${id}`, emp);
  return res.data;
};

export const deleteEmployee = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
