const mongoose = require("mongoose");
const User = require("./user-model");
const Schema = mongoose.Schema;

// Define the Booking schema
const bookingSchema = new Schema({
  category: {
    type: String,
    required: true,
    trim: true,
  },
  mealType: {
    type: String,
    required: true,
    trim: true,
  },
  days: {
    type: [Number],
    required: true,
    trim: true,
  },
  month: {
    type: String,
    required: true,
    trim: true,
  },
  year: {
    type: Number,
    required: true,
    trim: true,
  },
  bookingCategory: {
    type: String,
  },
  notes: {
    type: String,
    default: false,
  },
  bookingCount: {
    type: Number,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
  },
  employee: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
  }
});

// define the model or the collection name
const Booking = new mongoose.model("Booking", bookingSchema);
module.exports = Booking;
