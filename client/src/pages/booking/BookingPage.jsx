import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { AddBooking } from './AddBooking'; // Import the AddBooking component
import { Footer } from '../../components/Footer';
import { BookingList } from './BookingList';
import { BookingListOthers } from './BookingListOthers';
import bookingService from '../../services/bookingService';

export const BookingPage = () => {
  const [isOpenAddBooking, setIsOpenAddBooking] = useState(false);
  const [showOthers, setShowOthers] = useState(false);

  useEffect(() => {
    // Fetch users list when the component mounts
    fetchBooking();
  }, [showOthers]);

  const [bookingResponse, setBookingResponse] = useState(null);
  const handleClose = () => setIsOpenAddBooking(false);
  const handleShow = () => setIsOpenAddBooking(true);

  const fetchBooking = async () => {
    try {
      const response = await bookingService.bookingList({ isEmployee: !showOthers });
      setBookingResponse(response);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const toggleShowOthers = (data) => {
    if (data === "others") {
      setShowOthers(true);
    } else {
      setShowOthers(false);
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

        <div className="content-tab">
          <a className={`content-tab_link ${showOthers ? "" : "active"}`} onClick={toggleShowOthers} href="#">
            Rishabh Employees
          </a>
          <a className={`content-tab_link ${showOthers ? "active" : ""}`} onClick={() => toggleShowOthers("others")} href="#">
            Others
          </a>
        </div>

        {!showOthers ? <BookingList BookingResponse={bookingResponse} /> : <BookingListOthers BookingResponse={bookingResponse}  />}

        <AddBooking isOpen={isOpenAddBooking} handleClose={handleClose} />
        <Footer />
      </div>
    </>
  );
};