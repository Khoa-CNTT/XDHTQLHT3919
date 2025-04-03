import React from 'react';

const Modal = ({ isOpen, onClose, room }) => {
    if (!isOpen) return null;

    return (
        <div className="modal" id="roomModal">
            <div className="modal__content">
                <button className="modal__close" onClick={onClose}>&times;</button>
                <div className="modal__body">
                    <div className="modal__image">
                        <img src={room.image} alt={room.title} />
                    </div>
                    <div className="modal__details">
                        <h2>{room.title }</h2>
                        <p className="modal__price">{room.price}</p>
                        <div className="modal__description">
                            <p>{room.description}</p>
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