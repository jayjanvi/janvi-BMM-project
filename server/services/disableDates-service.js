const Booking = require("../models/booking-model");
const DisableDates = require("../models/disableDate-model");
const sendEmail = require("../utils/email/sendEmail");
const { getUserById } = require("./user-service");

// add disable date
const addDisableDates = async (data) => {
  try {
    await DisableDates.create(data);

    const filteredBookings = await filterBookings(data.startDate, data.endDate);

    for (const booking of filteredBookings) {
      let user = {};
      try {
        user = await getUserById(booking.employee);
      } catch (error) {
        throw new Error("User not found: " + booking.employee);
      }

      // await Booking.updateMany({ _id: booking._id }, { isDeleted: true });

      removeDaysFromBooking(booking,data.startDate,data.endDate);

      sendEmail(
        user.email,
        "Meal Book Cancelled from admin",
        {
          name: user.username,
          bookingType: booking.mealType,
          // startDate: await formatDate(booking.startDate),
          // endDate: await formatDate(booking.endDate),
        },
        "./template/bookingConfirm.handlebars"
      );
    }

    return "disable date created";
  } catch (error) {
    throw new Error("Error Add Disable Date: " + error.message);
  }
};

const removeDaysFromBooking = async (booking, startDateStr, endDateStr) => {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  const startDay = startDate.getUTCDate();
  const endDay = endDate.getUTCDate();

  try {
    // Find the booking by ID
    // const booking = await Booking.findById(bookingId);

    // if (!booking) {
    //   throw new Error("Booking not found");
    // }

    // Filter out the days that fall within the date range
    booking.days = booking.days.filter((day) => day < startDay || day > endDay);

    // Save the updated booking
    await booking.save();

    console.log("Updated booking:", booking);
  } catch (error) {
    console.error("Error updating booking:", error);
  }
};

const filterBookings = async (start, end) => {
  const bookings = await Booking.find({ isDeleted: false, employee: { $ne: null } });
  const startDate = new Date(start);
  const endDate = new Date(end);

  const startDay = startDate.getUTCDate();
  const endDay = endDate.getUTCDate();
  const startMonth = startDate.toLocaleString("default", { month: "long" });
  const endMonth = endDate.toLocaleString("default", { month: "long" });
  const startYear = startDate.getUTCFullYear();
  const endYear = endDate.getUTCFullYear();

  const isWithinRange = (day, month, year) => {
    if (year < startYear || year > endYear) return false;
    if (month < startMonth || month > endMonth) return false;
    return day >= startDay && day <= endDay;
  };

  const filteredBookings = bookings.filter((booking) => {
    const { year, month } = booking;
    if (booking.days) {
      return booking.days.some((day) => isWithinRange(day, month, year));
    } else if (booking.mealDate) {
      return booking.mealDate.some((day) => isWithinRange(day, month, year));
    }
    return false;
  });

  return filteredBookings;
};

const formatDate = (dateString) => {
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  return new Date(dateString).toLocaleDateString("en-GB", options);
};

const getAllDiasbleDates = async () => {
  try {
    const dates = await DisableDates.find();
    const newDates = [];

    for (const date of dates) {
      let newDate = {
        date: formatDate(date.startDate) + "-" + formatDate(date.endDate),
        reason: date.reason,
      };
      newDates.push(newDate);
    }

    // if (!dates || dates.length === 0) {
    //   throw new Error("No Dates found!", 404);
    // }
    return newDates;
  } catch (error) {
    throw new Error(error, 500);
  }
};

module.exports = {
  addDisableDates,
  getAllDiasbleDates,
};
