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
      
      sendEmail(
        user.email,
        "Meal Book Cancelled from admin",
        {
          name: user.name,
          bookingType: booking.mealType,
          startDate: await formatDate(booking.startDate),
          endDate: await formatDate(booking.endDate),
        },
        "./template/bookingConfirm.handlebars"
      );
    }

    return "disable date created";
  } catch (error) {
    throw new Error("Error Add Disable Date: " + error.message);
  }
};

const filterBookings = async (startDate, endDate) => {
  const bookings = await Booking.find({ isDeleted: false });
  const start = new Date(startDate);
  const end = new Date(endDate);

  return bookings.filter((booking) => {
    const bookingStart = new Date(booking.startDate);
    const bookingEnd = new Date(booking.endDate);

    return (bookingStart <= new Date(endDate)) && (bookingEnd >= new Date(startDate));

  });
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

    if (!dates || dates.length === 0) {
      throw new Error("No Dates found!", 404);
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
