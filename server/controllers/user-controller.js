const {
  addUserService,
  getAllUsersByType,
} = require("../services/user-service");

const addUser = async (req, res) => {
  const signupService = await addUserService(req.body);
  return res.json(signupService);
};

const getAllUsers = async (req, res) => {
  const users = await getAllUsersByType(req.body);
  return res.json(users);
};

module.exports = {
  addUser,
  getAllUsers,
};
