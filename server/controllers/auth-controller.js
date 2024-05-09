const {
  addUserService,
  loginUser,
  requestPasswordReset,
  resetPassword,
  changePassword,
  // addDepart,
  // getAllDepart
} = require("../services/auth-service");

const home = async (req, res) => {
  try {
    res.status(200).json({ msg: "Welcome to our home page" });
  } catch (error) {
    console.log(error);
  }
};

// // Add a new department
// const addDepartment = async (req, res) => {
//   try {
//     const { name, description } = req.body;
//     const newDepartment = new Department({ name, description });
//     await newDepartment.save();
//     res.status(201).json(newDepartment);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Get all departments
// const getAllDepartments = async (req, res) => {
//   try {
//     const departments = await Department.find();
//     res.json(departments);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
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
  home,
  resetPasswordRequestController,
  resetPasswordController,
  login,
  changePasswordController,
  // addDepartment,
  // getAllDepartments
};
