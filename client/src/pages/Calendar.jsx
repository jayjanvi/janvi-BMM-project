import React, { useState } from "react";
import { Navbar } from "../components/Navbar";
import Button from 'react-bootstrap/Button';
import { AddUser } from "./user/AddUser";
import { UserList } from "./user/userList";
import { Footer } from "../components/Footer";

export const Calendar = () => {
  //Add user modal
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      <Navbar />
      <div className="container-fluid">
        <div className="calendar-wrapper">
          <div className="container">
            <h3 className="main-title">Calendar</h3>
            <div className="row">
              <div className="col-lg-9">
                <div className="tile">Calendar</div>
              </div>
              <div className="col-lg-3">
                <div className="tile">
                  <h3 className="tile-title">Saturday, 19 Dec 2022</h3>
                  <div className="booking-wrapper">
                    <div className="booking-block">
                      <h5>Bookings</h5>
                      <a href="#" aria-label="Add Employees"><img src="src/assets/images/add-btn-1.svg" alt="Add"></img></a>
                    </div>
                    <div className="booking-block employees">
                      <div className="booking-block-lt">
                        <div className="icon-block"><i className="icon-employees"></i></div>
                        <div className="info-block">
                          <h5>Employees</h5>
                          <h3>200</h3>
                        </div>
                      </div>
                      <a href="#" aria-label="Add Employees"><img src="src/assets/images/add-btn-2.svg" alt="Add"></img></a>
                    </div>
                    <div className="booking-block non-employees">
                      <div className="booking-block-lt">
                        <div className="icon-block"><i className="icon-employees"></i></div>
                        <div className="info-block">
                          <h5>Non Employees</h5>
                          <h3>160</h3>
                        </div>
                      </div>
                      <a href="#" aria-label="Add Employees"><img src="src/assets/images/add-btn-2.svg" alt="Add"></img></a>
                    </div>
                    <div className="booking-block buffer">
                      <div className="booking-block-lt">
                        <div className="icon-block"><i className="icon-buffer"></i></div>
                        <div className="info-block">
                          <h5>Buffer</h5>
                          <h3>180</h3>
                        </div>
                      </div>
                      <a href="#" aria-label="Add Buffer"><img src="src/assets/images/add-btn-2.svg" alt="Add"></img></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};
