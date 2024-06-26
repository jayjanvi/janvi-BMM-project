const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth-controller");
const userControllers = require("../controllers/user-controller");
const bookingControllers = require("../controllers/booking-controller");
const disableDateList = require("../controllers/disableDates-controller");
const addUserSchema = require("../validators/auth-validator");
const validate = require("../middlewares/validate-middleware");

// Authentication
router.route("/login").post(authControllers.login);
router
  .route("/forgotPassword")
  .post(authControllers.resetPasswordRequestController);
router.route("/resetPassword").post(authControllers.resetPasswordController);
router.route("/changePassword").post(authControllers.changePasswordController);

// Users
router.route("/addUser").post(validate(addUserSchema), userControllers.addUser);
router.route("/users").get(userControllers.userList);
router.route("/findUsers").post(userControllers.searchUsers);
router.route("/deleteUser/:id").delete(userControllers.deleteUser);

// Booking
router.route("/addBooking").post(bookingControllers.addBooking);
router.route("/bookings").post(bookingControllers.bookingList);
router.route("/calendar").post(bookingControllers.bookingListByDate);
router.route("/deleteBooking/:id").delete(bookingControllers.deleteBooking);

//Disable Date
router.route("/addDisableDate").post(disableDateList.addDisableDate);
router.route("/disableDatesList").get(disableDateList.disableDateList);

module.exports = router;
