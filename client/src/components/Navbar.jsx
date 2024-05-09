import { NavLink, useNavigate } from "react-router-dom";
import React, { useState } from "react";

import AuthService from "../services/authService";
import { ChangePassword } from "../pages/ChangePassword";

export const Navbar = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState(null);

  // Handle Change password modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Admin Drop down
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Function to toggle the dropdown
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  // Function to close the dropdown
  const closeDropdown = () => {
    setDropdownOpen(false);
  };
  const handleOutsideClick = (event) => {
    if (!event.target.closest(".dropdown")) {
      setDropdownOpen(false);
    }
  };
  React.useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  
  const handleItemClick = (itemName) => {
    setActiveItem(itemName);
  };

  const handleLogout = () => {
    AuthService.logout();
    navigate("/login");
  };

  return (
    <>
      <ChangePassword show={show} handleClose={handleClose} />
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <div className="container head">
            <a href="#" className="navbar-brand">
              <div className="logoW-wrapper">
                <img
                  src="src/assets/images/logo-white.svg"
                  alt="Rishabh Software" />
                <span>Meal Facility</span>
              </div>
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation" >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent" >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className={`nav-item ${activeItem === "calendar" ? "active" : ""}`}>
                  <NavLink className="nav-link" to="/" onClick={() => handleItemClick("calendar")}>
                    Calendar
                  </NavLink>
                </li>
                <li className={`nav-item ${activeItem === "booking" ? "active" : ""}`}>
                  <NavLink className="nav-link" to="/booking" onClick={() => handleItemClick("booking")}>
                    Booking
                  </NavLink>
                </li>
                <li className={`nav-item ${activeItem === "user" ? "active" : ""}`}>
                  <NavLink className="nav-link" to="/user" onClick={() => handleItemClick("user")}>
                    User
                  </NavLink>
                </li>
              </ul>
              <div className="h-100 d-lg-inline-flex align-items-center">
                <ul className="app-nav">
                  {/* Notification Menu */}
                  <li className="dropdown">
                    <a
                      className="app-nav__item notification-num"
                      href="#"
                      data-toggle="dropdown"
                      aria-label="Show notifications" >
                      <i className="icon-bell"></i>
                      <span className="num">5</span>
                    </a>
                  </li>

                  {/* User Menu */}
                  <li className={`nav-item dropdown ${dropdownOpen ? "show" : ""  }`} >
                    <a className="app-nav__item dropdown-toggle"
                      href="#"
                      onClick={toggleDropdown}
                      aria-expanded={dropdownOpen ? "true" : "false"} >
                      Admin
                    </a>
                    <ul className={`dropdown-menu settings-menu dropdown-menu-right ${dropdownOpen ? "show" : "" }`}
                      onClick={closeDropdown}>
                      <li><a onClick={handleShow} className="dropdown-item" >Change Password</a></li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={handleLogout} >
                          Logout
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
      {/* <header>
        <div className="container">
          <div className="logo-brand">
            <NavLink to="/">ThapaTechnical</NavLink>
          </div>

          <nav>
            <ul>
              <li>
                <NavLink to="/"> Home </NavLink>
              </li>
              <li>
                <NavLink to="/about"> About </NavLink>
              </li>
              <li>
                <NavLink to="/service"> Services </NavLink>
              </li>
              <li>
                <NavLink to="/contact"> Contact </NavLink>
              </li>
              <li>
                <NavLink to="/addUser"> Add-User </NavLink>
              </li>
              <li>
                <NavLink to="/login"> Login </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </header> */}
    </>
  );
};
