import React, { useState, useEffect } from "react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import moment from 'moment';
import { Link } from 'react-router-dom';
import bookingService from '../../services/bookingService';
import { Calendar, momentLocalizer } from 'react-big-calendar';

const localizer = momentLocalizer(moment)

export const BookingCalendar = () => {

  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().getMonth() + '-' + new Date().getFullYear());
  const [bookings, setBookings] = useState(null);
  const [events, setEvents] = useState([]);
  const [counts, setCounts] = useState({ employee: 0, nonemployee: 0, customBooking: 0 });

  const handleSelectSlot = (slotInfo) => {
    setSelectedDay(slotInfo.start);
  };

  const handleNavigate = async (date) => {
    setSelectedDate(new Date(date).getMonth() + '-' + new Date(date).getFullYear());
    fetchBooking({ date: new Date(date).getMonth() + '-' + new Date(date).getFullYear() });
  };

  const getDateInFormat = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  useEffect(() => {
    setSelectedDay(new Date());
    fetchBooking({ date: selectedDate });
  }, []);

  useEffect(() => {
    bookings && setEvents(createEventsFromBookings(bookings));
  }, [bookings]);

  useEffect(() => {
    bookings && setCounts(getCount(bookings, selectedDay));
  }, [selectedDay, bookings]);

  const getCount = (bookings) => {

    const filteredBookings = bookings.filter(booking => {
      // Convert booking start and end dates to Date objects
      const startDate = new Date(booking.startDate);
      const endDate = new Date(booking.endDate);

      // Normalize the dates to only include the date part (ignore the time)
      const selectedDate = new Date(selectedDay.toISOString().split('T')[0]);
      const startDateOnly = new Date(startDate.toISOString().split('T')[0]);
      const endDateOnly = new Date(endDate.toISOString().split('T')[0]);

      // Filter the bookings based on the normalized date
      return selectedDate >= startDateOnly && selectedDate <= endDateOnly;
    });
    const employeeCount = filteredBookings.filter(booking => booking.category === 'employees').length;
    console.log('emp', filteredBookings.filter(booking => booking.category === 'employees'));
    const nonEmployeeCount = filteredBookings.filter(booking => booking.category === 'non_employees').length;
    console.log('non-emp', filteredBookings.filter(booking => booking.category === 'non_employees'));
    const customBookingCount = filteredBookings.filter(booking => booking.category === 'custom_booking').length;
    console.log('custom', filteredBookings.filter(booking => booking.category === 'custom_booking'));
    return { employee: employeeCount, nonemployee: nonEmployeeCount, customBooking: customBookingCount };
  }

  const createEventsFromBookings = (bookings) => {

    return bookings.map((booking, index) => {
      const startDate = moment(booking.startDate).utc().toDate();
      const endDate = moment(booking.endDate).endOf('day').utc().toDate();

      return {
        id: index,
        title: booking.mealType,
        start: startDate,
        end: endDate,
      };
    });
  };

  const fetchBooking = async (date) => {
    const bookings = await bookingService.bookingListByDate(date);
    setBookings(bookings.data);
  }

  const customSlotPropGetter = (date) => {
    if (selectedDay && date.toDateString() === selectedDay.toDateString()) {
      return { style: { backgroundColor: 'lightblue', }, };
    }
    return {};
  };

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
                    selectable
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    // views={['month']}
                    style={{ height: 500, margin: '50px', }}
                    onNavigate={handleNavigate}
                    onSelectSlot={handleSelectSlot}
                    dayPropGetter={customSlotPropGetter}
                  // eventPropGetter={(myEventsList) => {
                  //   const backgroundColor = myEventsList.colorEvento ? myEventsList.colorEvento : '#70f45e';
                  //   const color = myEventsList.color ? myEventsList.color : 'white';
                  //   return { style: { backgroundColor ,color} }
                  // }}
                  />
                </div>

              </div>
              <div className="col-lg-3">
                <div className="tile">
                  <h3 className="tile-title">{selectedDay && getDateInFormat(selectedDay)}</h3>
                  <div className="booking-wrapper">
                    <div style={{ display: 'flex', }}>
                      <div style={{ display: 'flex', }}>
                        <div className="booking-block" style={{ width: '150px', marginRight: '10px', backgroundColor: "#70f45e" }}>
                          <h5>Lunch</h5>
                        </div>
                        <div className="booking-block" style={{ width: '150px', backgroundColor: "#ff9e02" }}>
                          <h5>Dinner</h5>
                        </div>
                      </div>
                    </div>
                    <div className="booking-block">
                      <h5>Bookings</h5>
                      <Link to="/booking" aria-label="Add Employees">
                        <img src="src/assets/images/add-btn-1.svg" alt="Add"></img>
                      </Link>
                    </div>
                    <div className="booking-block employees">
                      <div className="booking-block-lt">
                        <div className="icon-block"><i className="icon-employees"></i></div>
                        <div className="info-block">
                          <h5>Employees</h5>
                          <h3>{counts.employee}</h3>
                        </div>
                      </div>
                      <Link to="/booking" aria-label="Add Employees">
                        <img src="src/assets/images/add-btn-2.svg" alt="Add"></img>
                      </Link>
                    </div>
                    <div className="booking-block non-employees">
                      <div className="booking-block-lt">
                        <div className="icon-block"><i className="icon-employees"></i></div>
                        <div className="info-block">
                          <h5>Non Employees</h5>
                          <h3>{counts.nonemployee}</h3>
                        </div>
                      </div>
                      <Link to="/booking" aria-label="Add Employees">
                        <img src="src/assets/images/add-btn-2.svg" alt="Add"></img>
                      </Link>
                    </div>
                    <div className="booking-block buffer">
                      <div className="booking-block-lt">
                        <div className="icon-block"><i className="icon-buffer"></i></div>
                        <div className="info-block">
                          <h5>Buffer</h5>
                          <h3>{counts.customBooking}</h3>
                        </div>
                      </div>
                      <Link to="/booking" aria-label="Add Employees">
                        <img src="src/assets/images/add-btn-2.svg" alt="Add"></img>
                      </Link>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
