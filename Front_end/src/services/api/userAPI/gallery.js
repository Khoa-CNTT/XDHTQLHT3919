import axios from 'axios';

const API_URL = 'https://localhost:7154/api/image';

export const getGalleryImages = async () => {
    try {
        const response = await axios.get(`${API_URL}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy ảnh từ API", error);
        throw error;
    }
};

export const uploadImageFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axios.post(`${API_URL}/upload-or-link`, formData);
    return res.data;
};
export const uploadImageUrl = async (imageUrl) => {
    const formData = new FormData();
    formData.append('imageUrl', imageUrl);
    const res = await axios.post(`${API_URL}/upload-or-link`, formData);
    return res.data;
};

export const deleteImage = async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
};