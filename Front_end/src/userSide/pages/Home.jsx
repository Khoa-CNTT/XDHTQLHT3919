import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";

import { useNavigate } from "react-router-dom";
import Helmet from "../components/Helmet/Helmet";
import "../styles/home.css"; // Đảm bảo bạn đã tạo CSS riêng cho trang Home
const Home = () => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const rooms = useSelector((state) => state.room.rooms); // Giả sử bạn có state rooms cho các phòng
    const bookings = useSelector((state) => state.booking.bookings); // Giả sử bạn có state bookings cho việc đặt phòng
    const [availableRooms, setAvailableRooms] = useState([]);
    const [userBookings, setUserBookings] = useState([]);
    
    const navigate = useNavigate();

    // Lọc phòng trống và phòng đã được đặt
    useEffect(() => {
        if (rooms.length !== 0) {
            const available = rooms.filter((room) => room.isAvailable); // Lọc phòng còn trống
            setAvailableRooms(available);
        }

        if (bookings.length !== 0 && currentUser) {
            const userBookedRooms = bookings.filter((booking) => booking.userId === currentUser.id);
            setUserBookings(userBookedRooms);
        }
    }, [rooms, bookings, currentUser]);

    return (
        <Helmet title={"Home"}>
            <section className="home__section">
                <Container>
                    <Row>
                        <Col lg="12" className="text-center">
                            <h1 className="section__title">Quản lý Homestay</h1>
                        </Col>
                    </Row>

                    {/* Danh sách phòng trống */}
                    <section className="available__rooms">
                        <Row>
                            <Col lg="12" className="text-center">
                                <h2 className="section__title">Danh sách phòng trống</h2>
                            </Col>
                            {availableRooms.length > 0 ? (
                                availableRooms.map((room) => (
                                    <Col lg="4" md="6" sm="12" key={room.id}>
                                        <div className="room__card">
                                            <h3>{room.name}</h3>
                                            <p>{room.description}</p>
                                            <p><strong>Giá:</strong> {room.price} VND</p>
                                            <Link to={`/book-room/${room.id}`} className="btn btn--primary">Đặt phòng</Link>
                                        </div>
                                    </Col>
                                ))
                            ) : (
                                <Col lg="12" className="text-center">
                                    <p>Hiện tại không có phòng trống.</p>
                                </Col>
                            )}
                        </Row>
                    </section>

                    {/* Danh sách phòng đã đặt */}
                    {userBookings.length > 0 && (
                        <section className="user__bookings">
                            <Row>
                                <Col lg="12" className="text-center">
                                    <h2 className="section__title">Phòng đã đặt của bạn</h2>
                                </Col>
                                {userBookings.map((booking) => (
                                    <Col lg="4" md="6" sm="12" key={booking.id}>
                                        <div className="booking__card">
                                            <h3>{booking.roomName}</h3>
                                            <p><strong>Ngày nhận phòng:</strong> {new Date(booking.checkIn).toLocaleDateString()}</p>
                                            <p><strong>Ngày trả phòng:</strong> {new Date(booking.checkOut).toLocaleDateString()}</p>
                                            <p><strong>Trạng thái:</strong> {booking.status}</p>
                                            <Link to={`/booking-details/${booking.id}`} className="btn btn--secondary">Chi tiết</Link>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </section>
                    )}
                </Container>
            </section>
        </Helmet>
    );
};

export default Home;
