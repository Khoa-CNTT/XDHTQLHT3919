import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import Home from "../userSide/pages/Home";
import Login from "../userSide/pages/Login";
import Signup from "../userSide/pages/Signup";
const Routers = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="home" element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />  
        </Routes>
    );
};

export default Routers;
