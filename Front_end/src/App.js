
import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

// Header và các components userSide
import Header from "./userSide/components/Headers/Header";
import Hero from "./userSide/components/Contents/Hero";
import Rooms from "./userSide/components/Contents/Rooms";
import Amenities from "./userSide/components/Contents/Amenities";
import Gallery from "./userSide/components/Contents/Gallery";
import Reviews from "./userSide/components/Contents/Reviews";
import Footer from "./userSide/components/Footers/Footer";
import RoomNew from "./userSide/components/Contents/RoomNew";
import Amenity from "./userSide/components/Contents/Amenity";

// BookingRoom
import Booking from "./userSide/components/BookingRoom/Booking";
import RoomDetail from "./userSide/components/BookingRoom/RoomDetail";
import RoomInfo from "./userSide/components/BookingRoom/RoomInfo";
import BookingHistory from "./userSide/components/BookingRoom/BookingHistory";
import PaymentResult from "./userSide/components/BookingRoom/PaymentResult";
// Auth
import Login from "./userSide/components/Auths/Login";
import Register from "./userSide/components/Auths/Register";
import ChangePassword from "./userSide/components/Auths/ChangePassword";
import ForgotPassword from "./userSide/components/Auths/ForgotPassword";
import ResetPassword from "./userSide/components/Auths/ResetPassword";

// Other - userSide
import Contact from "./userSide/components/Other/Contact";
import Profile from "./userSide/components/Other/Profile";
import PrivacyPolicy from "./userSide/components/Other/PrivacyPolicy";
import TermsOfService from "./userSide/components/Other/TermsOfService";
import PaymentMethod from "./userSide/components/BookingRoom/PaymentMethod";
import MovingText from "./userSide/components/Other/MovingText";

// Admin side
import AdminLayout from "./adminSide/components/headerAdmin/AdminLayout";
import Sidebar from "./adminSide/components/headerAdmin/Sidebar";
import Dashboard from "./adminSide/components/productManager/Dashboard";
import RoomManager from "./adminSide/components/productManager/RoomManager";
import UserManager from "./adminSide/components/userManager/UserManager";
import RoomCategoryManager from "./adminSide/components/productManager/RoomCategoryManager";
import BookingManagement from "./adminSide/components/productManager/BookingManagement";
import AmenityManager from "./adminSide/components/productManager/AmenityManager";
import ImageManager from "./adminSide/components/productManager/ImageManager";
import ServiceManager from "./adminSide/components/productManager/ServiceManagement";



import "./assets/Style/auth-css/auth.css";
import "./assets/Style/admin-css/adminLayout.css";
import "./assets/Style/home-css/indexx.css";

// import "./assets/Style/roomDetail/RoomDetailPage.css";

const Layout = ({ children }) => {
    const location = useLocation();
    const hideHeaderRoutes = ["/login", "/register", "/change", "/forgot", "/reset-password"];

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
                            <MovingText />
                            <RoomNew  onRoomClick={handleRoomClick} />
                            <Amenity />
                            <Gallery />
                            <Reviews />
                        </>
                    }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/change" element={<ChangePassword />} />
                <Route path="/forgot" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/room/:id" element={<RoomDetail />} />
                <Route path="/room" element={<Rooms />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/historybooking" element={<BookingHistory />} />
                <Route path="/amenities" element={<Amenities />} />
                <Route path="/booking" element={
                    <RoomDetail>
                        <Booking />
                    </RoomDetail>
                } />
                <Route path="/roominfo" element={
                    <RoomDetail>
                        <RoomInfo />
                    </RoomDetail>
                } />
                
                <Route path="/paymentMethod" element={<PaymentMethod />} />
                <Route path="/payment-result" element={<PaymentResult />} />


                <Route path="/adminlayout" element={<AdminLayout />} />
                <Route path="/sidebar" element={<Sidebar />} />
                <Route path="/privacypolicy" element={<PrivacyPolicy />} />
                <Route path="/termsOfservice" element={<TermsOfService />} />


                <Route path="/dashboard" element={
                    <AdminLayout>
                        <Dashboard />
                    </AdminLayout>
                } />
                <Route path="/roommanager" element={
                    <AdminLayout>
                        <RoomManager />
                    </AdminLayout>
                } />
                <Route path="/roomcategorymanager" element={
                    <AdminLayout>
                        <RoomCategoryManager />
                    </AdminLayout>
                } />
                <Route path="/usermanager" element={
                    <AdminLayout>
                        <UserManager />
                    </AdminLayout>
                } />
                <Route path="/bookingmanagement" element={
                    <AdminLayout>
                        <BookingManagement />
                    </AdminLayout>
                } />
                <Route path="/amenitymanager" element={
                    <AdminLayout>
                        <AmenityManager />
                    </AdminLayout>
                } />
                <Route path="/imagemanager" element={
                    <AdminLayout>
                        <ImageManager />
                    </AdminLayout>
                } />
                <Route path="/servicemanager" element={
                    <AdminLayout>
                        <ServiceManager />
                    </AdminLayout>
                } />
                {/* <Route path="/detail" element={<RoomDetailPage />} /> */}
                <Route path="/detail" element={<RoomDetail />} />
            </Routes>
        </Layout>
    );
};

export default App;
