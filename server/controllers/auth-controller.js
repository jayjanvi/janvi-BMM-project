const {
  addUserService,
  loginUser,
  requestPasswordReset,
  resetPassword,
  changePassword,
} = require("../services/auth-service");

const home = async (req, res) => {
  try {
    res.status(200).json({ msg: "Welcome to our home page" });
  } catch (error) {
    console.log(error);
  }
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

const changePasswordController = async (req, res, next) => {
  const changePasswordService = await changePassword(
    req.body.userId,
    req.body.password
  );
  return res.json(changePasswordService);
};

module.exports = {
  home,
  resetPasswordRequestController,
  resetPasswordController,
  login,
  changePasswordController,
};
