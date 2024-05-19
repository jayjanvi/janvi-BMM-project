const { createBooking, getAllBookings, deleteBookingById, getBookingsByDate } = require("../services/booking-service");

const addBooking = async (req, res) => {
    const booking = await createBooking(req.body);
    return res.json(booking);
  };

  const bookingList = async (req, res) => {
    const booking = await getAllBookings(req.body);
    return res.json(booking);
  };

  const deleteBooking = async (req, res) => {
    const booking = await deleteBookingById(req.params.id);
    return res.json(booking);
  };

  const bookingListByDate = async (req, res) => {
    const booking = await getBookingsByDate(req.body.date);
    return res.json(booking);
  };

  module.exports = {
    addBooking,
    bookingList,
    deleteBooking,
    bookingListByDate,
  };
