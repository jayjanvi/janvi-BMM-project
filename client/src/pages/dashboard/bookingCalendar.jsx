import React, { useState, useEffect } from "react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import moment from 'moment';
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
      const startDate = new Date(booking.startDate);
      const endDate = new Date(booking.endDate);
      return selectedDay >= startDate && selectedDay <= endDate;
    });

    const employeeCount = filteredBookings.filter(booking => booking.category === 'employees').length;
    console.log('emp',filteredBookings.filter(booking => booking.category === 'employees'));
    const nonEmployeeCount = filteredBookings.filter(booking => booking.category === 'non_employees').length;
    console.log('non-emp',filteredBookings.filter(booking => booking.category === 'non_employees'));
    const customBookingCount = filteredBookings.filter(booking => booking.category === 'custom_booking').length;
    console.log('custom',filteredBookings.filter(booking => booking.category === 'custom_booking'));
    return { employee: employeeCount, nonemployee: nonEmployeeCount, customBooking: customBookingCount };
  }

  const createEventsFromBookings = (bookings) => {
    return bookings.map((booking, index) => ({
      id: index,
      title: booking.mealType,
      start: new Date(booking.startDate),
      end: new Date(booking.endDate),
    }));
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
                    views={['month']}
                    style={{ height: 500, margin: '50px' }}
                    onNavigate={handleNavigate}
                    onSelectSlot={handleSelectSlot}
                    dayPropGetter={customSlotPropGetter}
                  />
                </div>

              </div>
              <div className="col-lg-3">
                <div className="tile">
                  <h3 className="tile-title">{selectedDay && getDateInFormat(selectedDay)}</h3>
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
                          <h3>{counts.employee}</h3>
                        </div>
                      </div>
                      <a href="#" aria-label="Add Employees"><img src="src/assets/images/add-btn-2.svg" alt="Add"></img></a>
                    </div>
                    <div className="booking-block non-employees">
                      <div className="booking-block-lt">
                        <div className="icon-block"><i className="icon-employees"></i></div>
                        <div className="info-block">
                          <h5>Non Employees</h5>
                          <h3>{counts.nonemployee}</h3>
                        </div>
                      </div>
                      <a href="#" aria-label="Add Employees"><img src="src/assets/images/add-btn-2.svg" alt="Add"></img></a>
                    </div>
                    <div className="booking-block buffer">
                      <div className="booking-block-lt">
                        <div className="icon-block"><i className="icon-buffer"></i></div>
                        <div className="info-block">
                          <h5>Buffer</h5>
                          <h3>{counts.customBooking}</h3>
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
      <Footer />
    </div>
  );
};
