import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom"; 
// Header và các components userSide
import Header from "./userSide/components/Headers/Header";
import Hero from "./userSide/components/Headers/Hero";
import Rooms from "./userSide/components/Headers/Rooms";
import Amenities from "./userSide/components/Headers/Amenities";
import Gallery from "./userSide/components/Headers/Gallery";
import Testimonials from "./userSide/components/Headers/Testimonials";
import Footer from "./userSide/components/Footers/Footer";
import Modal from "./userSide/components/Headers/Modal";
// Auth
import Login from "./userSide/components/Auths/Login";
import Register from "./userSide/components/Auths/Register";
import ChangePassword from "./userSide/components/Auths/ChangePassword";
// Other
import Contact from "./userSide/components/Other/Contact";
import RoomDetail from "./userSide/components/Other/RoomDetail";
import Profile from "./userSide/components/Other/Profile";
// Admin side
import HomeManager from "./adminSide/components/HomeManage";
// Style
import "./assets/Style/Auth.css";
import "./assets/Style/profile.css";
import "./assets/Style/manage.css";
import "./assets/Style/index.css";
import "./assets/Style/contact.css";
import "./assets/Style/roomDetail.css";

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
                <Route path="/change" element={<ChangePassword />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/room/:id" element={<RoomDetail />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/homemng" element={<HomeManager />} />
            </Routes>
        </Layout>
    );
};

export default App;
