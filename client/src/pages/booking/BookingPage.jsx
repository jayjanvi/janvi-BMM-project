import React, { useState,useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { AddBooking } from './AddBooking'; // Import the AddBooking component
import { Footer } from '../../components/Footer';
import { BookingList } from './BookingList';
import { ToastContainer, toast } from 'react-toastify';
import bookingService from '../../services/bookingService';

export const BookingPage = () => {
   const [isOpenAddBooking, setIsOpenAddBooking] = useState(false);

  useEffect(() => {
    // Fetch users list when the component mounts
    fetchBooking();
}, []);
  const [bookingResponse, setBookingResponse] = useState(null);
  const handleClose = () => setIsOpenAddBooking(false);
  const handleShow = () => setIsOpenAddBooking(true);

  const fetchBooking = async () => {
    try {
      
        const response = await bookingService.bookingList();
        console.log('res',response);
        setBookingResponse(response);
    } catch (error) {
        console.error("Error fetching users:", error);
    }
};

  return (
    <>
    <div>
      <Navbar />
      <div className="container-fluid">
          <div className="container pt-30 mb-30">
              <div className="container-head">
                 <div className="container-left">
                    <h3 className="container-title">Booking List</h3>
                </div>
              <div className="container-right">
              <button className="btn btn-primary" onClick={handleShow}>
                Add Booking</button>
            </div>
          </div>
        </div>
      </div>
      {bookingResponse && <BookingList BookingResponse={bookingResponse} />}
      {/* <AddBooking show={show} handleClose={handleClose} onAddUser={AddBooking} /> */}
      <AddBooking isOpen={isOpenAddBooking} handleClose={handleClose} />
      <Footer />
      <ToastContainer />
    </div>
    </>
  );
};