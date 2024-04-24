import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import { Calendar } from "./pages/Calendar";
import { Home } from "./pages/Home";
import { AddUser } from "./pages/user/AddUser";
import { Login } from "./pages/Login";
import { AddBooking } from "./pages/AddBooking";
import { ForgotPassword } from "./pages/ForgotPassword";
import "./App.css";
import AuthService from "./services/authService";
import ErrorPage from "./pages/Error";
import { BookingList } from "./pages/BookingList";

const App = () => {

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* <Route exact path="/" element={<Home />} /> */}
          <Route path="/*" element={<ErrorPage/>} />
          <Route path="/login" element={<ProtectedLogin />} />
          <Route path="/" element={<PrivateRoute />} />
          <Route path="/addUser" element={<AddUser />} />
          <Route path="/addBooking" element={<AddBooking />} />
          <Route path="/bookingList" element={<BookingList />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/calendar" element={<Calendar />} />
       
          {/* <Route path="/change_pass" element={<Change_Password />} />
          <Route path="/login" element={<Login />} />
          <Route index element={<Navigate to="/login" replace />} />
          <Route element={<PrivateRoute />}>
            <Route exact path="/" element={<Home />} />
          </Route> */}
        </Routes>
      </BrowserRouter>
    </>
  );
};
const ProtectedLogin = () => {
  const isAuthenticated = AuthService.isAuthenticated();
  return isAuthenticated ? <Navigate to="/" replace /> : <Login />;
};

const PrivateRoute = () => {
  const isAuthenticated = AuthService.isAuthenticated();
  return isAuthenticated ? <Home /> : <Navigate to="/login" replace />;
};

export default App;
