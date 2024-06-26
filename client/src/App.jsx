import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { ForgotPassword } from "./pages/ForgotPassword";
import "./App.css";
import AuthService from "./services/authService";
import ErrorPage from "./pages/Error";
import { UserFile } from "./pages/user/UserPage";
import { BookingPage } from "./pages/booking/BookingPage";
import { ResetPassword } from "./pages/ResetPassword";
import { BookingCalendar } from "./pages/dashboard/bookingCalendar";
import { DisableDateList } from "./pages/disableDate/DisableDateList";

const App = () => {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute pageLoad="home" />} />
          <Route path="/user" element={<PrivateRoute pageLoad="user" />} />
          <Route path="/disableDate" element={<PrivateRoute pageLoad="disableDate"  />} />
          <Route path="/booking" element={<PrivateRoute pageLoad="booking" />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/passwordReset" element={<ResetPassword />} />
          <Route path="/*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

const PrivateRoute = ({ pageLoad }) => {
  const isAuthenticated = AuthService.isAuthenticated();
  return isAuthenticated ? (
    <>
      {pageLoad === "home" && <BookingCalendar />}
      {pageLoad === "user" && <UserFile />}
      {pageLoad === "booking" && <BookingPage />}
      {pageLoad === "disableDate" && <DisableDateList />}
    </>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default App;
