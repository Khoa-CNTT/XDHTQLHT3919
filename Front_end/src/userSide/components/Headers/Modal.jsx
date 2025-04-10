import React, { useState, useEffect } from 'react';
import { fetchRoomDetails, fetchRoomImages } from '../../../api/room';

const Modal = ({ isOpen, onClose, roomId }) => {
    const [room, setRoom] = useState(null); // Lưu trữ dữ liệu phòng
    const [galleryImages, setGalleryImages] = useState([]); // Lưu trữ các ảnh của phòng
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!roomId) return;

        const fetchRoomData = async () => {
            setLoading(true);
            try {
                const roomData = await fetchRoomDetails(roomId);
                setRoom(roomData);

                const imagesData = await fetchRoomImages(roomId);
                setGalleryImages(imagesData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRoomData();
    }, [roomId]);

    if (!isOpen) return null; // Nếu modal không mở, không hiển thị gì
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="modal" id="roomModal">
            <div className="modal__content">
                <button className="modal__close" onClick={onClose}>&times;</button>
                <div className="modal__body">
                    <div className="modal__image">
                        {/* Hiển thị ảnh đầu tiên */}
                        <img src={room.image} alt={room.title} />
                    </div>
                    <div className="modal__details">
                        <h2>{room.title}</h2>
                        <p className="modal__price">{room.price}</p>
                        <div className="modal__description">
                            <p>{room.description}</p>
                        </div>
                        <div className="modal__gallery">
                            {/* Hiển thị các ảnh khác */}
                            {galleryImages.map((image, index) => (
                                <div key={index} className="gallery-item">
                                    <img src={image.src} alt={`Gallery Image ${index + 1}`} />
                                </div>
                            ))}
                        </div>
                        <form className="modal__booking">
                            <h3>Đặt phòng</h3>
                            <div className="form-group">
                                <label htmlFor="checkin">Ngày nhận phòng</label>
                                <input type="date" id="checkin" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="checkout">Ngày trả phòng</label>
                                <input type="date" id="checkout" required />
                            </div>
                            <button type="submit" className="btn btn--primary">Xác nhận đặt phòng</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
