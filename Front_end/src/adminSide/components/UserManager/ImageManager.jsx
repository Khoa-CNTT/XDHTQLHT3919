import React, { useEffect, useState } from 'react';
import { getGalleryImages, uploadImageFile, uploadImageUrl, deleteImage } from '../../../services/api/userAPI/gallery';
import '../../../assets/Style/admin-css/ImageManager.css'

const ImageManager = () => {
    const [images, setImages] = useState([]);
    const [file, setFile] = useState(null);
    const [url, setUrl] = useState('');

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        const data = await getGalleryImages();
        setImages(data);
    };

    const handleFileUpload = async () => {
        if (!file) return alert("Chọn tệp trước!");
        await uploadImageFile(file);
        setFile(null);
        fetchImages();
    };

    const handleUrlUpload = async () => {
        if (!url) return alert("Nhập URL trước!");
        await uploadImageUrl(url);
        setUrl('');
        fetchImages();
    };

    const handleDelete = async (id) => {
        await deleteImage(id);
        fetchImages();
    };

    return (
        <div className="image-manager">
            <h2>Quản lý thư viện ảnh</h2>

            <div>
                <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                <button onClick={handleFileUpload}>Tải ảnh lên từ máy</button>
            </div>

            <div>
                <input
                    type="text"
                    placeholder="Dán đường dẫn ảnh..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <button onClick={handleUrlUpload}>Thêm ảnh từ URL</button>
            </div>

            <hr />

            <div className="gallery__grid">
                {images.map((img) => (
                    <div className="gallery-item" key={img.id}>
                        <img src={img.src} alt={img.alt} width="150" />
                        <button onClick={() => handleDelete(img.id)}>Xoá</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageManager;
