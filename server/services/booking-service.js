const Booking = require("../models/booking-model");
const { getUserById } = require("./user-service");

// Create booking
const createBooking = async (data) => {
  try {
    const booking = await Booking.create(data);
    return booking;
  } catch (error) {
    throw new Error("Error creating booking: " + error.message);
  }
};

// Delete booking by ID
const deleteBookingById = async (bookingId) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(bookingId);
    if (!deletedBooking) {
      throw new Error("Booking not found");
    }
    return deletedBooking;
  } catch (error) {
    throw new Error("Error deleting booking: " + error.message);
  }
};

// Update booking by ID
const updateBookingById = async (bookingId, updatedData) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      updatedData,
      { new: true }
    );
    if (!updatedBooking) {
      throw new Error("Booking not found");
    }
    return updatedBooking;
  } catch (error) {
    throw new Error("Error updating booking: " + error.message);
  }
};

// Get all bookings
const getAllBookings = async () => {
  try {
    const bookings = await Booking.find();
    return updateBookingsWithEmployeeDetails(bookings);
  } catch (error) {
    throw new Error("Error fetching bookings: " + error.message);
  }
};
// Define a function to update all bookings with employee details
async function updateBookingsWithEmployeeDetails(bookings) {
  const updatedBookings = [];
  // Iterate through each booking
  for (const booking of bookings) {
    // Update booking object with employee details
    const bookingObj = await updateBookingWithEmployeeDetails(booking);
    updatedBookings.push(...bookingObj);
  }
  return updatedBookings;
}

async function updateBookingWithEmployeeDetails(booking) {
  const bookingObjs = [];
  // Fetch employee details for each employee ID in the booking
  let user;
  for (const employeeId of booking.employee) {
    try {
      user = await getUserById(employeeId);
    } catch (error) {
      throw new Error("User not found: " + employeeId);
    }
    // Construct booking object for each employee
    const bookingObj = {
      empCode: user.code,
      empName: user.username,
      department: user.department,
      mealType: booking.mealType,
      totalMeals: getBusinessDaysCount(booking.startDate, booking.endDate),
      mealDate: getBusinessDays(booking.startDate, booking.endDate), // Assuming startDate is a Date object
    };

    bookingObjs.push(bookingObj);
  }
  return bookingObjs;
}

function getBusinessDaysCount(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let count = 0;

  // Loop through each day between start and end dates
  for (
    let current = start;
    current <= end;
    current.setDate(current.getDate() + 1)
  ) {
    // Check if the current day is not a weekend (Saturday or Sunday)
    if (current.getDay() !== 0 && current.getDay() !== 6) {
      count++;
    }
  }
  return count;
}

function getBusinessDays(startDate, endDate) {
  const dates = [];
  const current = new Date(startDate);
  const end = new Date(endDate);
  while (current <= end) {
    // Check if the current day is not a weekend (Saturday or Sunday)
    if (current.getDay() !== 0 && current.getDay() !== 6) {
      dates.push(current.getDate());
    }
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

// Get booking by ID
const getBookingById = async (bookingId) => {
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }
    return booking;
  } catch (error) {
    throw new Error("Error fetching booking: " + error.message);
  }
};

module.exports = {
  createBooking,
  deleteBookingById,
  updateBookingById,
  getAllBookings,
  getBookingById,
};
