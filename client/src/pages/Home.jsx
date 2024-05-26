import React, { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import Button from 'react-bootstrap/Button';
import { AddUser } from "./user/AddUser";
import { UserList } from "./user/userList";

export const Home = () => {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  
  const handleShow = () => {
    console.log('handle show called ')
    setShow(true)
  };

  return (
    <div>
      <Navbar />
      <div className="container-fluid">
        <div className="container pt-30 mb-30">
          <div className="container-head">
            <div className="container-left">
              <h3 className="container-title">User List</h3>
            </div>
            <Button as="a" variant="primary" onClick={handleShow}>
              Add User
            </Button>
          </div>
        </div>
      </div>
      <AddUser key={show.toString()} show={show} handleClose={handleClose} />
      <UserList />
      
      {/* Footer */}
      <div className="footer">
        <div className="container">
          <div className="footer-block">
            <p>Copyright © 2022 Rishabh Software. All Rights Reserved.</p>
            <div className="social">
              <a href="#" aria-label="Facebook">
                <i className="icon-facebook"></i>
              </a>
              <a href="#" aria-label="Instagram">
                <i className="icon-instagram"></i>
              </a>
              <a href="#" aria-label="Linkedin">
                <i className="icon-linkedin"></i>
              </a>
              <a href="#" aria-label="Twitter">
                <i className="icon-twitter"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
