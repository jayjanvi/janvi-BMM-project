const { createBooking, getAllBookings } = require("../services/booking-service");

const addBooking = async (req, res) => {
    const booking = await createBooking(req.body);
    return res.json(booking);
  };

  const bookingList = async (req, res) => {
    const booking = await getAllBookings(req.body);
    return res.json(booking);
  };

  module.exports = {
    addBooking,
    bookingList,
  };
