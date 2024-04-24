const User = require("../models/user-model");

// User Registration
const addUserService = async (data) => {
    try {
      const { username, email, phone, password } = data;
  
      const userExist = await User.findOne({ email });
      if (userExist) {
        throw new Error("Email already exist", 422);
      }
      const userCreated = await User.create(data);
  
      return (data = {
        msg: "Registration successful",
        username: username,
        userId: userCreated._id.toString(),
        token: await userCreated.generateToken(),
      });
    } catch (error) {
      throw new Error(error, 500);
    }
  };

  const getAllUsersByType = async (type) => {
    try {  
      const users = await User.find();
      if (!users || users.length === 0) {
        throw new Error("No users found!", 404);
      }
      return users;
    } catch (error) {
      throw new Error(error, 500);
    }
  };

  module.exports = {
    addUserService,
    getAllUsersByType,
  }