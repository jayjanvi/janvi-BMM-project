const {
  addUserService,
  getAllUsers,
  findUsers,
} = require("../services/user-service");

const addUser = async (req, res) => {
  const signupService = await addUserService(req.body);
  return res.json(signupService);
};

const userList = async (req, res) => {
  const users = await getAllUsers(req.body);
  return res.json(users);
};

const searchUsers = async (req, res) => {
  const users = await findUsers(req.body.value);
  return res.json(users);
};

module.exports = {
  addUser,
  userList,
  searchUsers,
};
