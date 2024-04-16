const User = require("../models/user-model");
const {
  signup,
  loginUser,
  requestPasswordReset,
  resetPassword,
} = require("../services/auth-service");

const home = async (req, res) => {
  try {
    res.status(200).json({ msg: "Welcome to our home page" });
  } catch (error) {
    console.log(error);
  }
};

const register = async (req, res, next) => {
  const signupService = await signup(req.body);
  return res.json(signupService);
};

const login = async (req, res, next) => {
  const loginService = await loginUser(req.body);
  return res.json(loginService);
};

const resetPasswordRequestController = async (req, res, next) => {
  const requestPasswordResetService = await requestPasswordReset(
    req.body.email
  );
  return res.json(requestPasswordResetService);
};

const resetPasswordController = async (req, res, next) => {
  const resetPasswordService = await resetPassword(
    req.body.userId,
    req.body.token,
    req.body.password
  );
  return res.json(resetPasswordService);
};

module.exports = {
  home,
  register,
  resetPasswordRequestController,
  resetPasswordController,
  login,
};
