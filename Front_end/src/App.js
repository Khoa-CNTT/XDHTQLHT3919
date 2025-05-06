
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

// BookingRoom
import Booking from "./userSide/components/BookingRoom/Booking";
import RoomDetail from "./userSide/components/BookingRoom/RoomDetail";
import RoomInfo from "./userSide/components/BookingRoom/RoomInfo";
import BookingHistory from "./userSide/components/BookingRoom/BookingHistory";

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

// Admin side
import AdminLayout from "./adminSide/components/adminSide/AdminLayout";
import Sidebar from "./adminSide/components/adminSide/Sidebar";
import Dashboard from "./adminSide/components/adminSide/Dashboard";
import ProductList from "./adminSide/components/productManager/RoomList";
import UserList from "./adminSide/components/UserManager/UserList";
import RoomCategory from "./adminSide/components/productManager/RoomCategoryList";
import BookingManagement from "./adminSide/components/productManager/BookingManagement";



import "./assets/Style/Auth-css/auth.css";
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
                            <Rooms  onRoomClick={handleRoomClick} />
                            <Amenities />
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
                <Route path="/profile" element={<Profile />} />
                <Route path="/historybooking" element={<BookingHistory />} />
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


                <Route path="/adminlayout" element={<AdminLayout />} />
                <Route path="/sidebar" element={<Sidebar />} />
                <Route path="/privacypolicy" element={<PrivacyPolicy />} />
                <Route path="/termsOfservice" element={<TermsOfService />} />


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
                <Route path="/roomcategorylist" element={
                    <AdminLayout>
                        <RoomCategory />
                    </AdminLayout>
                } />
                <Route path="/userlist" element={
                    <AdminLayout>
                        <UserList />
                    </AdminLayout>
                } />
                <Route path="/bookingmanagement" element={
                    <AdminLayout>
                        <BookingManagement />
                    </AdminLayout>
                } />
                {/* <Route path="/detail" element={<RoomDetailPage />} /> */}
                <Route path="/detail" element={<RoomDetail />} />
            </Routes>
        </Layout>
    );
};

export default App;
