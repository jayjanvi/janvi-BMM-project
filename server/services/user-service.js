const User = require("../models/user-model");
const sendEmail = require("../utils/email/sendEmail");

// User Registration
const addUserService = async (data) => {
  try {
    const { username, email, phone, password } = data;

    const userExist = await User.findOne({ email });
    if (userExist) {
      throw new Error("Email already exist", 422);
    }
    const userCreated = await User.create(data);

    sendEmail(
      userCreated.email,
      "Registered in meal facility app",
      {
        name: userCreated.username,
        email: userCreated.email,
        password: userCreated.password,
      },
      "./template/createUserConfirm.handlebars"
    );
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

const getAllUsers = async () => {
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

async function findUsers(query) {
  try {
    const users = await User.find({
      $and: [
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
    throw error;
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

module.exports = {
  addUserService,
  getAllUsers,
  getUserById,
  findUsers,
};
