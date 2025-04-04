
import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom"; 
import Header from "./userSide/components/Header";
import Hero from "./userSide/components/Hero";
import Rooms from "./userSide/components/Rooms";
import Amenities from "./userSide/components/Amenities";
import Gallery from "./userSide/components/Gallery";
import Testimonials from "./userSide/components/Testimonials";
import Footer from "./userSide/components/Footer";
import Modal from "./userSide/components/Modal";
import Login from "./userSide/components/Login";
import Register from "./userSide/components/Register";
import "./assets/Style/Auth.css";
import "./assets/Style/index.css";

const Layout = ({ children }) => {
    const location = useLocation();
    const hideHeaderRoutes = ["/login", "/register"]; // Ẩn Header và Footer ở trang Login, Register

    return (
        <>
            {!hideHeaderRoutes.includes(location.pathname) && <Header />}
            {children}
            {!hideHeaderRoutes.includes(location.pathname) && <Footer />}
        </>
    );
};

const App = () => {
    const navigate = useNavigate(); 
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);

    const handleRoomClick = (room) => {
        setSelectedRoom(room);
        setModalOpen(true);
    };

    const handleLoginClick = () => {
        navigate("/login"); // Chuyển hướng đến trang login
    };

    return (
        <Layout> 
            <Routes>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route 
                    path="/home" 
                    element={
                        <>
                            <Hero />
                            <Rooms onRoomClick={handleRoomClick} />
                            <Amenities />
                            <Gallery />
                            <Testimonials />
                            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} room={selectedRoom} />
                        </>
                    } 
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </Layout>
    );
};

export default App;
