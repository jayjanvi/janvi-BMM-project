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
const addUserSchema = require("../validators/auth-validator");
const validate = require("../middlewares/validate-middleware");

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
router.route("/users").get(userControllers.getAllUsers);

module.exports = router;
