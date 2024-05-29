const {
  addUserService,
  getAllUsers,
  findUsers,
  deleteUserById
} = require("../services/user-service");

const addUser = async (req, res) => {
  const signupService = await addUserService(req.body);
  return res.json(signupService);

};

const userList = async (req, res) => {
  const users = await getAllUsers(req.body);
  return res.json(users);
};

const deleteUser = async (req, res) => {
  const user = await deleteUserById(req.params.id);
  return res.json(user);
};

const searchUsers = async (req, res) => {
  const users = await findUsers(req.body.value);
  return res.json(users);
};

module.exports = {
  addUser,
  userList,
  searchUsers,
  deleteUser
};
