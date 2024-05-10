const Booking = require("../models/booking-model");
const { getUserById } = require("./user-service");

// Create booking
const createBooking = async (data) => {
  try {
    const bookings = [];

    if (data.employee.length !== 0) {
      for (const employeeId of data.employee) {
        const bookingData = { ...data, employee: employeeId }; // Replace `employee` array with individual employeeId
        const booking = await Booking.create(bookingData);
        bookings.push(booking);
      }
    } else {
      const bookingData = { ...data, employee: null };
      await Booking.create(bookingData);
    }
    return bookings;
  } catch (error) {
    throw new Error("Error creating booking: " + error.message);
  }
};

// Delete booking by ID
const deleteBookingById = async (bookingId) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { isDeleted: true },
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

// Get all bookings for employees
const getAllBookings = async (isEmployee) => {
  try {
    const bookings = await Booking.find({ isDeleted: false });
    const employeeBooking = bookings.filter(booking => booking.employee !== null);
    const nonEmployeeBooking = bookings.filter(booking => booking.employee === null);
    if (isEmployee) {
      return getBookingsDetailsForEmployee(employeeBooking);
    } else {
      return nonEmployeeBooking;
    }
  } catch (error) {
    throw new Error("Error fetching bookings: " + error.message);
  }
};
// Define a function to update all bookings with employee details
async function getBookingsDetailsForEmployee(bookings) {
  const bookingObjs = [];
  // Iterate through each booking
  for (const booking of bookings) {
    // Update booking object with employee details
    try {
      user = await getUserById(booking.employee);
    } catch (error) {
      throw new Error("User not found: " + booking.employee);
    }
    // Construct booking object for each employee
    const bookingObj = {
      id: booking._id,
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
