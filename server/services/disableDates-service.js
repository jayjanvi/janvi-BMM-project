const Booking = require("../models/booking-model");
const DisableDates = require("../models/disableDate-model");
const sendEmail = require("../utils/email/sendEmail");
const { getUserById } = require("./user-service");

// add disable date
const addDisableDates = async (data) => {
  try {
    const filteredBookings = await filterBookings(data.startDate, data.endDate);

    for (const booking of filteredBookings) {
      if (booking.employee) {
        try {
          let user = await getUserById(booking.employee);
          sendEmail(
            user.email,
            "Meal Book Cancelled from admin",
            {
              name: user.username,
              bookingType: booking.mealType,
              startDate: formatDate(data.startDate),
              endDate: formatDate(data.endDate),
            },
            "./template/bookingCancelled.handlebars"
          );
        } catch (error) {
          throw new Error("User not found: " + booking.employee);
        }
      }
      removeDaysFromBooking(booking, data.startDate, data.endDate);
    }
    await DisableDates.create(data);

    return "disable date created";
  } catch (error) {
    throw new Error("Error Add Disable Date: " + error.message);
  }
};

const removeDaysFromBooking = async (booking, startDateStr, endDateStr) => {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  const startDay = startDate.getDate();
  const endDay = endDate.getDate();

  try {
    // Filter out the days that fall within the date range
    booking.days = booking.days.filter((day) => day < startDay || day > endDay);

    if (booking.days.length === 0) {
      // delete booking if there are no any days
      await Booking.updateMany({ _id: booking._id }, { isDeleted: true });
    } else {
      // Save the updated booking
      await booking.save();
    }

    return booking;
  } catch (error) {
    throw new Error(error, 500);
  }
};

const filterBookings = async (start, end) => {
  const bookings = await Booking.find({ isDeleted: false });
  const startDate = new Date(start);
  const endDate = new Date(end);

  const startDay = startDate.getDate();
  const endDay = endDate.getDate();
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

    return newDates;
  } catch (error) {
    throw new Error(error, 500);
  }
};

module.exports = {
  addDisableDates,
  getAllDiasbleDates,
};
