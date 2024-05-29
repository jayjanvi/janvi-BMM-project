const Booking = require("../models/booking-model");
const User = require("../models/user-model");
const sendEmail = require("../utils/email/sendEmail");
const mongoose = require('mongoose');

// User Registration
const addUserService = async (data) => {

  try {
    const { username, email, password } = data;

    const userExist = await User.findOne({ email });
    if (userExist) {
      throw new Error("Email already exists", 422);
    }

    // Send email with plaintext password before hashing it
    await sendEmail(
      email,
      "Registered in meal facility app",
      {
        name: username,
        email: email,
        password: password, // send the plaintext password
      },
      "./template/createUserConfirm.handlebars"
    );

    const userCreated = await User.create({ ...data });

    return {
      msg: "Registration successful",
      username: username,
      userId: userCreated._id.toString(),
      token: await userCreated.generateToken(),
      password: userCreated.password,
    };
  } catch (error) {
    throw new Error(error.message || error, 500);
  }
};

const getAllUsers = async () => {
  try {
    const users = await User.find({isDeleted: false});
    // const users = await User.find();
    if (!users || users.length === 0) {
      throw new Error("No users found!", 404);
    }
    return users;
  } catch (error) {
    throw new Error(error, 500);
  }
};

async function findUsers(query) {
  try {
    const users = await User.find({
      $and: [
        {isDeleted: false},
        { isEmployee: true }, // isEmployee is true condition
        {
          $or: [
            { username: { $regex: new RegExp(query, "i") } },
            // { code: { $regex: new RegExp(query, 'i') } },
            { department: { $regex: new RegExp(query, "i") } },
          ],
        },
      ],
    })
      .limit(10)
      .exec(); // Limit to first 10 records
    return users;
  } catch (error) {
    throw new Error(error, 500);
  }
}

const getUserById = async (userId) => {
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new Error("No users found!", 404);
    }
    return user;
  } catch (error) {
    throw new Error(error, 500);
  }
};

// Delete user by ID
const deleteUserById = async (userId) => {
  try {
    let result = null;

    const updatedBooking = await Booking.updateMany(
      { employee: userId },
      { $set: { isDeleted: true } }
    );

    result = await User.updateMany(
      { _id: userId },
      { isDeleted: true }
    );

    if (result.nModified === 0) {
      throw new Error("No users found for this employee");
    }
    return result;
  } catch (error) {
    throw new Error("Error updating user: " + error.message);
  }
};



module.exports = {
  addUserService,
  getAllUsers,
  getUserById,
  findUsers,
  deleteUserById
};
