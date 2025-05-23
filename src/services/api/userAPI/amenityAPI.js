import axios from "axios";

const API_URL = "https://localhost:7154/api/amenity";

export const getAllAmenities = () => axios.get(API_URL);

export const createAmenity = (data) => axios.post(API_URL, data);

export const updateAmenity = (id, data) => axios.put(`${API_URL}/${id}`, data);

export const deleteAmenity = (id) => axios.delete(`${API_URL}/${id}`);

