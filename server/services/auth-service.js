const JWT = require("jsonwebtoken");
const User = require("../models/user-model");
const Token = require("../models/token-model");
const sendEmail = require("../utils/email/sendEmail");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const clientURL = process.env.CLIENT_URL;
const bcryptSalt = process.env.BCRYPT_SALT;

// User Registration
const signup = async (data) => {
  try {
    const { username, email, phone, password } = data;

    const userExist = await User.findOne({ email });
    if (userExist) {
      throw new Error("Email already exist", 422);
    }
    const userCreated = await User.create({ username, email, phone, password });

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

//Login User
const loginUser = async (data) => {
  try {
    const { email, password } = data;
    const userExist = await User.findOne({ email });
    if (!userExist) {
      throw new Error("Invalid credentials", 400);
    }
    const user = await userExist.comparePassword(password);
    if (user) {
      return (data = {
        message: "Login Successful",
        username: userExist.username,
        userId: userExist._id.toString(),
        token: await userExist.generateToken()
      });
    } else {
      throw new Error("Invalid email or password", 400);
    }
  } catch (error) {
    throw new Error(error, 400);
  }
};

const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email });

  if (!user) throw new Error("User does not exist");

  let token = await Token.findOne({ userId: user._id });
  if (token) await token.deleteOne();

  let resetToken = crypto.randomBytes(32).toString("hex");
  const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));

  await new Token({
    userId: user._id,
    token: hash,
    createdAt: Date.now(),
  }).save();

  const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user._id}`;
  sendEmail(user.email, "Password Reset Request", {name: user.name, link: link,}, "./template/requestResetPassword.handlebars");
  return link;
};

const resetPassword = async (userId, token, password) => {
  let passwordResetToken = await Token.findOne({ userId });
  if (!passwordResetToken) {
    throw new Error("Invalid or expired password reset token");
  }
  const isValid = await bcrypt.compare(token, passwordResetToken.token);
  if (!isValid) {
    throw new Error("Invalid or expired password reset token");
  }
  const hash = await bcrypt.hash(password, Number(bcryptSalt));
  await User.updateOne(
    { _id: userId },
    { $set: { password: hash } },
    { new: true }
  );
  const user = await User.findById({ _id: userId });
  sendEmail( user.email, "Password Reset Successfully", { name: user.name, }, "./template/resetPassword.handlebars");
  await passwordResetToken.deleteOne();
  return true;
};

module.exports = {
  signup,
  loginUser,
  requestPasswordReset,
  resetPassword,
};
