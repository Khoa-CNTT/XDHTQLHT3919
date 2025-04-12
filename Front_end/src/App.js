
import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom"; 
import Header from "./userSide/components/Headers/Header";
import Hero from "./userSide/components/Contents/Hero";
import Rooms from "./userSide/components/Contents/Rooms";
import Amenities from "./userSide/components/Contents/Amenities";
import Gallery from "./userSide/components/Contents/Gallery";
import Testimonials from "./userSide/components/Contents/Testimonials";
import Footer from "./userSide/components/Footers/Footer";
import Modal from "./userSide/components/Contents/Modal";
import Login from "./userSide/components/Auths/Login";
import Register from "./userSide/components/Auths/Register";
import ChangePassword from "./userSide/components/Auths/ChangePassword"
import Contact from "./userSide/components/Other/Contact"
import RoomDetail from "./userSide/components/Other/RoomDetail"
import Profile from "./userSide/components/Other/Profile"
import AdminLayout from "./adminSide/components/AdminLayout"
import Sidebar from "./adminSide/components/Sidebar";
import Dashboard from "./adminSide/components/Dashboard";
import ProductList from "./adminSide/components/ProductList";
import "./assets/Style/Auth-css/auth.css";
import "./assets/Style/Auth-css/profile.css";
import "./assets/Style/admin-css/adminLayout.css";
import "./assets/Style/admin-css/sidebar.css";
import "./assets/Style/admin-css/dashboard.css";
import "./assets/Style/admin-css/productList.css";
import "./assets/Style/home-css/index.css";
import "./assets/Style/home-css/contact.css";
import "./assets/Style/home-css/roomDetail.css";

const Layout = ({ children }) => {
    const location = useLocation();
    const hideHeaderRoutes = ["/login", "/register", "/change"];

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
        navigate("/login");
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
                <Route path="/adminlayout" element={<AdminLayout />} />
                <Route path="/sidebar" element={<Sidebar />} />
                <Route path="/dashboard" element={
                    <AdminLayout>
                        <Dashboard />
                    </AdminLayout>
                } />
                <Route path="/productlist" element={
                    <AdminLayout>
                        <ProductList />
                    </AdminLayout>
                } />
                
            </Routes>
        </Layout>
    );
};

export default App;
