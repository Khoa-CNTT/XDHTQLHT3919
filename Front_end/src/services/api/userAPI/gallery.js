import axios from 'axios';

const API_URL = 'https://localhost:7154/api/image';

export const getGalleryImages = async () => {
    const res = await axios.get(API_URL);
    return res.data;
};

export const uploadImage = async (formData) => {
    await axios.post(`${API_URL}/upload-or-link`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const deleteImage = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
};
