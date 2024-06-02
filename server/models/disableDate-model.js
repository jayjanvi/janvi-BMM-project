const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Booking schema
const disableDateSchema = new Schema({
  startDate: {
    type: Date,
    required: true,
    trim: true,
  },
  endDate: {
    type: Date,
    required: true,
    trim: true,
  },
  reason: {
    type: String,
    default: false,
  },
});

const DisableDates = new mongoose.model("DisableDates", disableDateSchema);
module.exports = DisableDates;
