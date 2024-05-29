const Booking = require("../models/booking-model");
const sendEmail = require("../utils/email/sendEmail");
const { getAllDiasbleDates } = require("./disableDates-service");
const { getUserById } = require("./user-service");

const formatDate = async (dateString) => {
  const date = new Date(dateString);
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
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    const startMonth = startDate.getMonth();
    const endMonth = endDate.getMonth();
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();

    if (startMonth === endMonth && startYear === endYear) {
      const days = await getBusinessDays(startDate, endDate);
      const month = startDate.toLocaleString("default", { month: "long" });
      const year = startDate.getFullYear();

      if (data.employee.length !== 0) {
        for (const employeeId of data.employee) {

          let existingBooking = await Booking.findOne({
            employee: employeeId,
            mealType: data.mealType,
            month: month,
            year: year,
            isDeleted: false,
          });

          if (existingBooking) {
           
            const combinedDays = Array.from(
              new Set([...existingBooking.days, ...days])
            );
            combinedDays.sort((a, b) => a - b);
            existingBooking.days = combinedDays;
            existingBooking.bookingCount = combinedDays.length;
            await existingBooking.save();
          } else {
           
            const bookingData = {
              ...data,
              days: days,
              month: month,
              year: year,
              employee: employeeId,
            };

            const booking = await Booking.create(bookingData);
            bookings.push(booking);

            // Send an email to the user if needed
            const user = await getUserById(booking.employee);
            // Send confirmed email to employee
            sendEmail(
              user.email,
              "Lunch Meal Booking Confirmation",
              {
                name: user.name,
                bookingType: booking.mealType,
                startDate: await formatDate(data.startDate),
                endDate: await formatDate(data.endDate),
              },
              "./template/bookingConfirm.handlebars"
            );
          }
        }
      } else {
        // Create booking for non-employees
        const bookingData = {
          ...data,
          days: days,
          month: month,
          year: year,
          employee: null,
        };
        const booking = await Booking.create(bookingData);
        return booking;
      }
    } else {
      // If start date and end date are in different months
      let currentDate = new Date(startDate);
      while (
        currentDate.getMonth() !== endDate.getMonth() ||
        currentDate.getFullYear() !== endDate.getFullYear()
      ) {
        const currentMonthEndDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0
        );
        const bookingEndDate =
          currentDate.getDate() < currentMonthEndDate.getDate()
            ? currentDate
            : currentMonthEndDate;

        const days = await getBusinessDays(bookingEndDate, currentMonthEndDate);
        const month = currentDate.toLocaleString("default", { month: "long" });
        const year = currentDate.getFullYear();

        // Process bookings for employees
        if (data.employee.length !== 0) {
          for (const employeeId of data.employee) {
           
            let existingBooking = await Booking.findOne({
              employee: employeeId, 
              mealType: data.mealType,
              month: month,
              year: year,
              isDeleted: false,
            });

            if (existingBooking) {
             
              const combinedDays = Array.from(
                new Set([...existingBooking.days, ...days])
              );
              combinedDays.sort((a, b) => a - b);
              existingBooking.days = combinedDays;
              existingBooking.bookingCount = combinedDays.length;
              await existingBooking.save();
            } else {
              // Create a new booking
              const bookingData = {
                ...data,
                days: days,
                month: month,
                year: year,
                employee: employeeId,
              };

              const booking = await Booking.create(bookingData);
              bookings.push(booking);

              // Send an email to the user if needed
              const user = await getUserById(booking.employee);
              // Send confirmed email to employee
              sendEmail(
                user.email,
                "Lunch Meal Booking Confirmation",
                {
                  name: user.name,
                  bookingType: booking.mealType,
                  startDate: await formatDate(currentDate),
                  endDate: await formatDate(bookingEndDate),
                },
                "./template/bookingConfirm.handlebars"
              );
            }
          }
        } else {
          // Process bookings for non-employees
          const bookingData = {
            ...data,
            days: days,
            month: month,
            year: year,
            employee: null,
          };
          const booking = await Booking.create(bookingData);
          bookings.push(booking);
        }
        currentDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          1
        );
      }
      // Process the last month
      const days = await getBusinessDays(currentDate, endDate);
      const month = currentDate.toLocaleString("default", { month: "long" });
      const year = currentDate.getFullYear();

      // Process bookings for employees
      if (data.employee.length !== 0) {
        for (const employeeId of data.employee) {
          // Check if the employee already has a booking with the same meal type
          let existingBooking = await Booking.findOne({
            employee: employeeId,
            mealType: data.mealType,
            month: month,
            year: year,
            isDeleted: false,
          });

          if (existingBooking) {
            // Update the existing booking
            const combinedDays = Array.from(
              new Set([...existingBooking.days, ...days])
            );
            combinedDays.sort((a, b) => a - b);
            existingBooking.days = combinedDays;
            existingBooking.bookingCount = combinedDays.length;
            await existingBooking.save();
          } else {
            // Create a new booking
            const bookingData = {
              ...data,
              days: days,
              month: month,
              year: year,
              employee: employeeId,
            };

            const booking = await Booking.create(bookingData);
            bookings.push(booking);

            // Send an email to the user if needed
            const user = await getUserById(booking.employee);
            // Send confirmed email to employee
            sendEmail(
              user.email,
              "Lunch Meal Booking Confirmation",
              {
                name: user.name,
                bookingType: booking.mealType,
                startDate: await formatDate(currentDate),
                endDate: await formatDate(endDate),
              },
              "./template/bookingConfirm.handlebars"
            );
          }
        }
      } else {
        // Process bookings for non-employees
        const bookingData = {
          ...data,
          days: days,
          month: month,
          year: year,
          employee: null,
        };
        const booking = await Booking.create(bookingData);
        bookings.push(booking);
      }
    }
    return bookings;
  } catch (error) {
    throw new Error("Error creating booking: " + error.message);
  }
};

// Delete booking by ID
const deleteBookingById = async (bookingId) => {
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }
    let result = null;
    if (booking.employee) {
      result = await Booking.updateMany(
        { employee: booking.employee },
        { isDeleted: true }
      );
    } else {
      result = await Booking.updateMany(
        { _id: bookingId },
        { isDeleted: true }
      );
    }

    if (result.nModified === 0) {
      throw new Error("No bookings found for this employee");
    }

    return result;
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
      return getBookingsDetailsForNonEmployee(nonEmployeeBooking, data.date);
    }
  } catch (error) {
    throw new Error("Error fetching bookings: " + error.message);
  }
};
async function getBookingsDetailsForNonEmployee(bookings, date) {
  const bookingObjs = [];
  const month = date.split("-")[0];
  const year = date.split("-")[1];

  const filteredBookings = bookings.filter((booking) => {
    return booking.month === month && booking.year === Number(year);
  });
  return filteredBookings;
}

function formatDateList(dateString) {
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  return new Date(dateString).toLocaleDateString("en-GB", options);
}

async function getBookingsDetailsForEmployee(bookings, date) {
  const bookingObjs = [];
  const month = date.split("-")[0];
  const year = date.split("-")[1];

  const filteredBookings = bookings.filter((booking) => {
    return booking.month === month && booking.year === Number(year);
  });

  const userBookingsMap = new Map();

  for (const booking of filteredBookings) {
    let user = {};
    try {
      user = await getUserById(booking.employee);
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
      totalMeals: booking.days.length,
      mealDate: booking.days,
    };

    userBookingsMap.set(booking.employee + newBooking.mealType, newBooking);
    bookingObjs.push(newBooking);
  }

  return bookingObjs;
}

async function getBookingsByDate(date) {
  try {
    const month = date.split("-")[0]; // Extract the month from the provided date
    const year = date.split("-")[1]; // Extract the year from the provided date
    const bookings = await Booking.find({ isDeleted: false });
    const filteredBookings = bookings.filter((booking) => {
      return booking.month === month && booking.year === Number(year);
    });
    return filteredBookings;
  } catch (error) {
    throw new Error("Error fetching bookings: " + error.message);
  }
}

// Function to get business days between two dates
const getBusinessDays = async (startDate, endDate) => {
  const dates = [];
  const current = new Date(startDate);
  const end = new Date(endDate);
  const disableDates = await getAllDiasbleDates();
  while (current <= end) {
    // Check if the current day is not a weekend (Saturday or Sunday)
    if (await isWeekdayWithHolidays(current,disableDates)) {
      dates.push(current.getDate());
    }
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

const isWeekdayWithHolidays = async (date,disableDates) => {
  const day = date.getDay();
  // Check if the date falls on a weekend (Saturday or Sunday)
  if (day === 0 || day === 6) {
    return false; // Disable weekends
  }
  return !await isHoliday(date,disableDates); // Check if it's a holiday
};

const isHoliday = async (date,disableDates) => {
  for (const holiday of disableDates) {
    const [start, end] = holiday.date.split("-");
    const [startDay, startMonth, startYear] = start.split("/");
    const [endDay, endMonth, endYear] = end.split("/");

    const startDate = new Date(startYear, startMonth - 1, startDay);
    const endDate = new Date(endYear, endMonth - 1, endDay);

    if (date >= startDate && date <= endDate) {
      return true; // Date is within a holiday period
    }
  }
  return false; // Date is not a holiday
};

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
  getBookingsByDate,
  getBookingById,
};
