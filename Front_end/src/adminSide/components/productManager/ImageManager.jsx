import React, { useEffect, useState } from 'react';
import { getGalleryImages, uploadImage, deleteImage } from '../../../services/api/userAPI/galleryAPI';
import '../../../assets/Style/admin-css/ImageManager.css'
import Notification from '../../../userSide/components/Other/Notification';

const ImageManager = () => {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');

  // State cho notification
  const [notif, setNotif] = useState({ show: false, message: '' });

  useEffect(() => {
    fetchImages();
  }, []);

  const showNotification = (message) => {
    setNotif({ show: true, message });
  };

  const hideNotification = () => {
    setNotif({ show: false, message: '' });
  };

  const fetchImages = async () => {
    const data = await getGalleryImages();
    setImages(data);
  };

  const handleFileUpload = async () => {
    if (!file) {
      showNotification("Vui lòng chọn tệp trước!");
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    try {
      await uploadImage(formData);
      showNotification("Tải ảnh thành công!");
      setFile(null);
      fetchImages();
    } catch (error) {
      showNotification("Lỗi khi tải ảnh từ máy!");
    }
  };

  const handleUrlUpload = async () => {
    if (!url) {
      showNotification("Vui lòng nhập URL ảnh!");
      return;
    }
    const formData = new FormData();
    formData.append('imageUrl', url);

    try {
      await uploadImage(formData);
      showNotification("Thêm ảnh từ URL thành công!");
      setUrl('');
      fetchImages();
    } catch (error) {
      showNotification("Lỗi khi thêm ảnh từ URL!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteImage(id);
      showNotification("Đã xoá ảnh!");
      fetchImages();
    } catch (error) {
      showNotification("Lỗi khi xoá ảnh!");
    }
  };

  return (
    <div className="image-manager">
      <h2>Quản lý thư viện ảnh</h2>

      <div>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button className='btnImage' onClick={handleFileUpload}>Tải ảnh lên từ máy</button>
      </div>

      <div>
        <input
          type="text"
          placeholder="Dán đường dẫn ảnh..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button className='btnImage' onClick={handleUrlUpload}>Thêm ảnh từ URL</button>
      </div>

      <hr />

      <div className="gallery__grid">
        {images.map((img) => (
          <div className="gallery-item" key={img.id}>
            <img
              src={img.src.startsWith('http') ? img.src : `https://localhost:7154${img.src}`}
              alt={img.alt || 'Ảnh'}
              width="150"
            />
            <button className='btnImage' onClick={() => handleDelete(img.id)}>Xoá</button>
          </div>
        ))}
      </div>

      <Notification message={notif.message} show={notif.show} onClose={hideNotification} />
    </div>
  );
};

export default ImageManager;
