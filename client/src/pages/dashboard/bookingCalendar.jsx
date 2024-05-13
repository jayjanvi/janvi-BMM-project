import React, { useState } from "react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';

const localizer = momentLocalizer(moment)

export const BookingCalendar = () => {

  const handleNavigate = (date, view) => {
    // You can perform any other actions based on the new date and view
    console.log("Selected month:", moment(date).format('MMMM YYYY'));
  };

  const events = [
    {
      id: 0,
      title: '1',
      start: new Date(2024, 4, 13, 10, 0),
      end: new Date(2024, 4, 13, 12, 0),
    },
    {
      id: 2,
      title: '5',
      start: new Date(2024, 4, 13, 10, 0),
      end: new Date(2024, 4, 13, 12, 0),
    },
    {
      id: 1,
      title: '2',
      start: new Date(2024, 4, 15, 12, 0),
      end: new Date(2024, 4, 15, 14, 0),
    },
  ];

  return (
    <div>
      <Navbar />
      <div className="container-fluid">
        <div className="calendar-wrapper">
          <div className="container">
            <h3 className="main-title">Calendar</h3>
            <div className="row">
              <div className="col-lg-9">
                <div className="tile">
                  {/* Calendar */}
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 500,margin: '50px'  }}
                  onNavigate={handleNavigate}
                />
                </div>
                
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
