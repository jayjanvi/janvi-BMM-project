import { BrowserRouter,Routes,Route} from "react-router-dom"

import { Home} from "./pages/Home";
import { Change_Password } from "./pages/Change_password";
// import { Contact } from "./pages/Contact";
// import { Service } from "./pages/Service";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Navbar } from "./components/Navbar";
import "./App.css";

const App = () => {
  return <>
  
  <BrowserRouter>
  {/* <Navbar /> */}
  <Routes>
    <Route path="/home" element={<Home />} />
    <Route path="/change_pass" element={<Change_Password />} /> 
    {/* <Route path="/contact" element={<Contact />} />
    <Route path="/service" element={<Service />} /> */}
    <Route path="/register" element={<Register />} />
    <Route path="/login" element={<Login />} />  
  </Routes>
</BrowserRouter>
</>
};

export default App;