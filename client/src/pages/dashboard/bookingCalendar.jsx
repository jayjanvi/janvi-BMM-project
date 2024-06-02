import React, { useState, useEffect } from "react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import moment from 'moment';
import { Link } from 'react-router-dom';
import bookingService from '../../services/bookingService';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import disableDateService from "../../services/disableDateService";

const localizer = momentLocalizer(moment)

export const BookingCalendar = () => {
  const months = [
    "January", "February", "March", "April", "May",
    "June", "July", "August", "September", "October",
    "November", "December"
  ];

  const mealTypeColors = {
    "Lunch": "#ae49cc",
    "Dinner": "#ea855b"
  };

  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDate, setSelectedDate] = useState(months[new Date().getMonth()] + '-' + new Date().getFullYear());
  const [bookings, setBookings] = useState(null);
  const [events, setEvents] = useState([]);
  const [counts, setCounts] = useState({ employee: 0, nonemployee: 0, customBooking: 0 });
  const [disableDates, setDisableDates] = useState([]);

  const handleSelectSlot = (slotInfo) => {
    setSelectedDay(slotInfo.start);
  };

  const handleNavigate = async (date) => {
    setSelectedDate(months[new Date(date).getMonth()] + '-' + new Date(date).getFullYear());
    fetchBooking({ date: months[new Date(date).getMonth()] + '-' + new Date(date).getFullYear() });
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
    fetchDisableDates();
  }, [bookings]);

  useEffect(() => {
    bookings && setCounts(getCount(bookings));
  }, [selectedDay, bookings]);

  const getCount = (bookings) => {
    const selectedDay1 = new Date(selectedDay).getDate();
    const bookingsForSelectedDay = bookings.filter(booking => booking.days.includes(selectedDay1));
    return bookingsForSelectedDay.reduce((count, booking) => {
      if (booking.category === 'employees') {
        count.employee += 1;
      } else if (booking.category === 'non_employees') {
        count.nonemployee += 1;
      } else if (booking.category === 'custom_booking') {
        count.customBooking += 1;
      }
      if (booking.mealType === 'Lunch') {
        count.lunch += 1;
      } else if (booking.mealType === 'Dinner') {
        count.dinner += 1;
      }
      return count;
    }, { employee: 0, nonemployee: 0, customBooking: 0, lunch: 0, dinner: 0 });
  }

  const createEventsFromBookings = (bookings) => {
    // Initialize events array
    const events = [];
    bookings.forEach((booking, index) => {
      // Iterate over days in the booking
      booking.days.forEach(day => {
        // Create event object
        const event = {
          id: index,
          title: booking.mealType,
          start: new Date(booking.year, months.indexOf(booking.month), day), // Assuming current month
          end: new Date(booking.year, months.indexOf(booking.month), day + 1), // Assuming events are for a single day
          color: mealTypeColors[booking.mealType] // Set color based on meal type
        };
        events.push(event);
      });
    });
    return events;
  };

  const fetchBooking = async (date) => {
    const bookings = await bookingService.bookingListByDate(date);
    setBookings(bookings.data);
  }

  const parseDate = dateString => {
    const [start, end] = dateString.split('-');
    return {
      start: moment(start, 'DD/MM/YYYY').toDate(),
      end: moment(end, 'DD/MM/YYYY').toDate()
    };
  };

  const fetchDisableDates = async () => {
    try {
      const response = await disableDateService.disableDateList();
      const disabledDates = response.data.map(item => parseDate(item.date))
      setDisableDates(disabledDates);
    } catch (error) {
      console.error('Error fetching disable dates:', error);
    }
  };

  const isDisabled = date => {
    return disableDates.some(disabledDate =>
      date >= disabledDate.start && date <= disabledDate.end
    );
  };

  const customSlotPropGetter = (date) => {
    if (selectedDay && date.toDateString() === selectedDay.toDateString()) {
      return { style: { backgroundColor: 'lightblue', }, };
    }
    if (isDisabled(date)) {
      return {
        className: 'disabled-date'
      };
    }
    return {};
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = event.color;
    return {
      style: {
        backgroundColor
      }
    };
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
                    eventPropGetter={eventStyleGetter}
                  />
                </div>
              </div>
              <div className="col-lg-3">
                <div className="tile">
                  <h3 className="tile-title">{selectedDay && getDateInFormat(selectedDay)}</h3>
                  <div className="booking-wrapper">
                    <div style={{ display: 'flex', }}>
                      <div className="booking-block" style={{ width: '50%', marginRight: '10px', backgroundColor: mealTypeColors["Lunch"] }}>
                        <h5 style={{ color: 'white' }}>Lunch: {counts.lunch}</h5>
                      </div>
                      <div className="booking-block" style={{ width: '50%', backgroundColor: mealTypeColors["Dinner"] }}>
                        <h5 style={{ color: 'white' }}>Dinner: {counts.dinner}</h5>
                      </div>
                    </div>
                    {/* <div className="booking-block">
                      <h5>Bookings</h5>
                      <Link to="/booking" aria-label="Add Employees">
                        <img src="src/assets/images/add-btn-1.svg" alt="Add"></img>
                      </Link>
                    </div> */}
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
                          <h5>Custome Booking</h5>
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
