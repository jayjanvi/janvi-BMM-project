import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { AddBooking } from './AddBooking'; // Import the AddBooking component

export const BookingList = () => {
  const [showAddBookingModal, setShowAddBookingModal] = useState(false); // State for controlling modal visibility

  // Function to handle opening the Add Booking modal
  const handleOpenAddBookingModal = () => {
    setShowAddBookingModal(true);
  };

  // Function to handle closing the Add Booking modal
  const handleCloseAddBookingModal = () => {
    setShowAddBookingModal(false);
  };

  return (
    <div>
      <Navbar />
      <div className="container-fluid">
        <div className="container pt-30 mb-30">
          <div className="container-head">
            <div className="container-left">
              <h3 className="container-title">Booking List</h3>
            </div>
            <div className="container-right">
              <button className="btn btn-primary" onClick={handleOpenAddBookingModal}>Add Booking</button>
            </div>
          </div>
          <div className="content-tab">
            <a className="content-tab_link active" href="#">Rishabh Employees</a>
            <a className="content-tab_link" href="#">Others</a>
          </div>
        </div>
      </div>
      <div className="footer">
        <div className="container">
          <div className="footer-block">
            <p>Copyright © 2022 Rishabh Software. All Rights Reserved.</p>
            <div className="social">
              <a href="#" aria-label="Facebook"><i className="icon-facebook"></i></a>
              <a href="#" aria-label="Instagram"><i className="icon-instagram"></i></a>
              <a href="#" aria-label="Linkedin"><i className="icon-linkedin"></i></a>
              <a href="#" aria-label="Twitter"><i className="icon-twitter"></i></a>
            </div>
          </div>
        </div>
      </div>

      {/* Add Booking modal */}
      {showAddBookingModal && <AddBooking handleClose={handleCloseAddBookingModal} />}
    </div>
  );
};


// import React, { useState } from "react";
// import { Navbar } from "../components/Navbar";
// import Button from 'react-bootstrap/Button';
//  import { AddBooking } from "../pages/AddBooking";
// // import { BookingList } from "./pages/BookingList";

// export const BookingList = () => {
//   //Add user modal
//   const [show, setShow] = useState(false);

//   const handleClose = () => setShow(false);
//   const handleShow = () => setShow(true);

//   return (
//   <div>
//     <Navbar/>
//   <div class="container-fluid">
//       <div class="container pt-30 mb-30">
//         <div class="container-head">
//           <div class="container-left">
//             <h3 class="container-title">Booking List</h3>
//           </div>
//           <div class="container-right">
//           {/* <Button as="a" variant="primary" onClick={handleShow}>
//                 Add Booking
//               </Button> */}
//           <Button as="a" variant="primary" data-target="#addBooking" 
//           data-toggle="modal" aria-label="Add Booking" className="btn btn-primary"onClick={handleShow}>
//               Add Booking
//             </Button>
//             {/* <a href="#" aria-label="Add Booking" class="btn btn-primary" data-toggle="modal" 
//             data-target="#addBooking">Add Booking</a> */}
//           </div>
//         </div>

//         <div class="content-tab">
//           <a class="content-tab_link active" href="#">Rishabh Employees</a>
//           <a class="content-tab_link" href="#">Others</a>
//           </div> 

//       </div>
      
//     </div>
//     <AddBooking show={show} handleClose={handleClose} />
     
//     <div class="footer">
//       <div class="container">
//         <div class="footer-block">
//           <p>Copyright © 2022 Rishabh Software. All Rights Reserved.</p>
//           <div class="social">
//             <a href="#" aria-label="Facebook"><i class="icon-facebook"></i></a>
//             <a href="#" aria-label="Instagram"><i class="icon-instagram"></i></a>
//             <a href="#" aria-label="Linkedin"><i class="icon-linkedin"></i></a>
//             <a href="#" aria-label="Twitter"><i class="icon-twitter"></i></a>
//           </div>
//         </div>
//       </div>
//     </div>
//     </div>
// )}