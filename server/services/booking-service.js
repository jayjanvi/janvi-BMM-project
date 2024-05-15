const Booking = require("../models/booking-model");
const sendEmail = require("../utils/email/sendEmail");
const { getUserById } = require("./user-service");

const formatDate = async (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${(day < 10 ? "0" : "") + day}-${
    (month < 10 ? "0" : "") + month
  }-${year}`;
};

// Create booking
const createBooking = async (data) => {
  try {
    const bookings = [];

    if (data.employee.length !== 0) {
      for (const employeeId of data.employee) {
        const bookingData = { ...data, employee: employeeId }; // Replace `employee` array with individual employeeId

        const booking = await Booking.create(bookingData);
        bookings.push(booking);

        const user = await getUserById(booking.employee);

        // Send confirmed email to employee
        sendEmail(
          user.email,
          "Lunch Meal Booking Confirmation",
          {
            name: user.name,
            bookingType: booking.mealType,
            startDate: await formatDate(booking.startDate),
            endDate: await formatDate(booking.endDate),
          },
          "./template/bookingConfirm.handlebars"
        );
      }
    } else {
      // Create booking for non-employees
      const bookingData = { ...data, employee: null };
      const booking = await Booking.create(bookingData);
      return booking;
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
const getAllBookings = async (data) => {
  try {
    const bookings = await Booking.find({ isDeleted: false });
    const employeeBooking = bookings.filter(
      (booking) => booking.employee !== null
    );
    const nonEmployeeBooking = bookings.filter(
      (booking) => booking.employee === null
    );
    if (data.isEmployee) {
      return getBookingsDetailsForEmployee(employeeBooking, data.date);
    } else {
      return nonEmployeeBooking;
    }
  } catch (error) {
    throw new Error("Error fetching bookings: " + error.message);
  }
};
// Define a function to update all bookings with employee details
// async function getBookingsDetailsForEmployee(bookings, date) {
//   const bookingObjs = [];
//   let user = {};
//   // Iterate through each booking
//   for (const booking of bookings) {
//     // Update booking object with employee details
//     try {
//       user = await getUserById(booking.employee);
//     } catch (error) {
//       throw new Error("User not found: " + booking.employee);
//     }
//     // Construct booking object for each employee
//     const bookingObj = {
//       id: booking._id,
//       empCode: user.code,
//       empName: user.username,
//       department: user.department,
//       mealType: booking.mealType,
//       totalMeals: getBusinessDaysCount(booking.startDate, booking.endDate),
//       mealDate: getBusinessDays(booking.startDate, booking.endDate), // Assuming startDate is a Date object
//     };
//     bookingObjs.push(bookingObj);
//   }
//   return bookingObjs;
// }

async function getBookingsDetailsForEmployee(bookings, date) {
  const bookingObjs = [];
  const month = new Date(date).getMonth(); // Extract the month from the provided date
  const year = new Date(date).getFullYear(); // Extract the year from the provided date
  const filteredBookings = bookings.filter((booking) => {
    const bookingMonth = booking.startDate.getMonth(); // Extract the month from the booking's startDate
    const bookingYear = booking.startDate.getFullYear(); // Extract the year from the booking's startDate
    return bookingMonth === month && bookingYear === year; // Check if the booking is in the specified month and year
  });

  const userBookingsMap = new Map(); // Map to store bookings per user

  // Iterate through each filtered booking
  for (const booking of filteredBookings) {
    let user = {}; // Initialize user object

    try {
      user = await getUserById(booking.employee); // Get user details for the booking's employee
    } catch (error) {
      throw new Error("User not found: " + booking.employee);
    }

    // If the booking cannot be combined with the previous one, create a new booking entry
    let newBooking = {
      id: booking._id,
      empCode: user.code,
      empName: user.username,
      department: user.department,
      mealType: booking.mealType,
      startDate: booking.startDate,
      endDate: booking.endDate,
      totalMeals: getBusinessDaysCount(booking.startDate, booking.endDate),
      mealDate: getBusinessDays(booking.startDate, booking.endDate),
    };
    const employeeIdString = booking.employee.toString();
    if (userBookingsMap.has(employeeIdString)) {
      const oldEmp = userBookingsMap.get(booking.employee.toString());
      const index = bookingObjs.findIndex((b) => b.empCode === oldEmp.empCode);
      if (index !== -1) {
        const mealDates = Array.from(new Set(oldEmp.mealDate.concat(getBusinessDays(booking.startDate, booking.endDate))));
        const sortedMealDates = mealDates.sort((a, b) => a - b);
        bookingObjs[index].mealDate = sortedMealDates;
        bookingObjs[index].totalMeals = bookingObjs[index].mealDate.length;
      }
    } else {
      userBookingsMap.set(booking.employee.toString(), newBooking);
      bookingObjs.push(newBooking);
    }
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
