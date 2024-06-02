const {
  addUserService,
  loginUser,
  requestPasswordReset,
  resetPassword,
  changePassword,
} = require("../services/auth-service");

const login = async (req, res) => {
  const loginService = await loginUser(req.body);
  return res.json(loginService);
};

const resetPasswordRequestController = async (req, res) => {
  const requestPasswordResetService = await requestPasswordReset(
    req.body.email
  );
  return res.json(requestPasswordResetService);
};

const resetPasswordController = async (req, res) => {
  const resetPasswordService = await resetPassword(
    req.body.userId,
    req.body.token,
    req.body.password
  );
  return res.json(resetPasswordService);
};

const changePasswordController = async (req, res) => {
  const changePasswordService = await changePassword(
    req.body.userId,
    req.body.password
  );
  return res.json(changePasswordService);
};

module.exports = {
  resetPasswordRequestController,
  resetPasswordController,
  login,
  changePasswordController,
};
