// const express = require('express')
// const router = express.Router()
// const home=require("../controllers/auth-controller")

// const app = express()

// router.get("/", (req, res) => {
//     res.send("hello welcome this is by router")
// })

// router.get("/register",(req, res) => {
//     res.send("hello welcome this is registration  by router")
// })

// // router.route("/").get((req,res)=>{
// //     res.send("hello welcome this is by router")
// // })

// module.exports = router;

const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth-controller");
const userControllers = require("../controllers/user-controller");
const bookingControllers = require("../controllers/booking-controller");
const addUserSchema = require("../validators/auth-validator");
const {createBooking, getAllBookings} = require("../services/booking-service");
const validate = require("../middlewares/validate-middleware");
// const { departmentList } = require("../controllers/depatment-controller");

// Authentication
router.route("/").get(authControllers.home);
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

// Booking
router.route("/addBooking").post(bookingControllers.addBooking);
router.route("/bookings").get(bookingControllers.bookingList);

//Department
// router.route("/department").get(authControllers.departmentController.getAllDepartments)
// router.get('/', departmentController.getAllDepartments);

// router.route("/adddepartment").post(authControllers.departmentController.createDepartment)
// router.post('/', departmentController.createDepartment);
// router.get('/:id', departmentController.getDepartmentById);
// router.put('/:id', departmentController.updateDepartment);
// router.delete('/:id', departmentController.deleteDepartment);


module.exports = router;
