import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Rooms = ({ onRoomClick }) => {
    const [roomsData, setRoomsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRoomsData = async () => {
            try {
                const response = await axios.get('axios.get("https://localhost:7145/api/rooms")');
                setRoomsData(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRoomsData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <section className="rooms section-padding">
            <div className="container2">
                <h2 className="section-title">Phòng nghỉ của chúng tôi</h2>
                <p className="section-subtitle">Các phòng nghỉ sang trọng với đầy đủ tiện nghi</p>
                <div className="rooms__grid">
                    {roomsData.map((room) => (
                        <div className="room-card" key={room.id}>
                            <div className="room-card__image">
                                <img src={room.image} alt={room.title} />
                            </div>
                            <div className="room-card__content">
                                <h3>{room.title}</h3>
                                <p className="room-price">{room.price}</p>
                                <button
                                    className="btn btn--primary"
                                    onClick={() => onRoomClick(room)}
                                >
                                    Chi tiết
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Rooms;
