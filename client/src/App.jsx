import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Calendar } from "./pages/Calendar";
import { Login } from "./pages/Login";
import { ForgotPassword } from "./pages/ForgotPassword";
import "./App.css";
import AuthService from "./services/authService";
import ErrorPage from "./pages/Error";
import { UserFile } from "./pages/user/UserPage";
import { BookingPage } from "./pages/booking/BookingPage";
import { ResetPassword } from "./pages/ResetPassword";

const App = () => {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute pageLoad="home"/>} />
          <Route path="/user" element={<PrivateRoute pageLoad="user"/>} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/passwordReset" element={<ResetPassword />} />
          <Route path="/*" element={<ErrorPage/>} />

        {/* <PrivateRoute path="/" element={<Calendar />} />
        <PrivateRoute path="/user" element={<UserFile />} />
        <PrivateRoute path="/booking" element={<BookingPage />} /> */}
       
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
// const ProtectedLogin = () => {
//   const isAuthenticated = AuthService.isAuthenticated();
//   return isAuthenticated ? <Navigate to="/" replace /> : <Login />;
// };

// const PrivateRoute = () => {
//   const isAuthenticated = AuthService.isAuthenticated();
//   return isAuthenticated ? <Calendar /> : <Navigate to="/login" replace />;
//   // return isAuthenticated ? <Home /> : <Navigate to="/login" replace />;
// };

const PrivateRoute = ({ pageLoad }) => {
  console.log(pageLoad);
  const isAuthenticated = AuthService.isAuthenticated();
  return isAuthenticated ? (
    <>
    {pageLoad === "home" && <Calendar />}
    {pageLoad === "user" && <UserFile />}
    {pageLoad === "booking" && <BookingPage />}
  </>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default App;
