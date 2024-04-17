import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import { Home } from "./pages/Home";
import { Change_Password } from "./pages/Change_password";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import "./App.css";

const App = () => {
  return <>

    <BrowserRouter>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/change_pass" element={<Change_Password />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />      
        <Route index element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </>
};

export default App;