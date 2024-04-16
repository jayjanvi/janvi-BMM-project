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
const signupSchema=require("../validators/auth-validator")
const validate =require("../middlewares/validate-middleware")

router.route("/").get(authControllers.home);
router.route("/register").post(validate(signupSchema), authControllers.register);
router.route("/login").post(authControllers.login);
router.route("/forgotPassword").post(authControllers.resetPasswordRequestController);
router.route("/resetPassword").post(authControllers.resetPasswordController);


module.exports = router;