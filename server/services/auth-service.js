const User = require("../models/user-model");
const Token = require("../models/token-model");
const sendEmail = require("../utils/email/sendEmail");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const clientURL = process.env.CLIENT_URL;
const bcryptSalt = process.env.BCRYPT_SALT;

// Login User
const loginUser = async (data) => {
  try {
    const { email, password } = data;
    const userExist = await User.findOne({ email });
    if (!userExist) {
      throw new Error("Invalid email or password", 400);
    }

    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, userExist.password);

    if (passwordMatch) {
      // Check if the user is an admin
      if (userExist.isAdmin) {
        const token = await userExist.generateToken();

        // Store the token in the database
        const tokenDoc = new Token({
          userId: userExist._id,
          token,
        });
        await tokenDoc.save();

        return {
          message: "Login Successful",
          username: userExist.username,
          userId: userExist._id.toString(),
          password: userExist.password,
          token
        };
      } else {
        throw new Error("You are not authorized to login as an admin", 403);
      }
    } else {
      throw new Error("Invalid email or password", 400);
    }
  } catch (error) {
    throw new Error(error.message || "Error occurred while logging in", 400);
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
  sendEmail(
    user.email,
    "Password Reset Request",
    { name: user.username, link: link },
    "./template/requestResetPassword.handlebars"
  );
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
  sendEmail(
    user.email,
    "Password Reset Successfully",
    { name: user.username },
    "./template/resetPassword.handlebars"
  );
  await passwordResetToken.deleteOne();
  return true;
};

const changePassword = async (userId, password) => {
  const hash = await bcrypt.hash(password, Number(bcryptSalt));
  await User.updateOne(
    { _id: userId },
    { $set: { password: hash } },
    { new: true }
  );
  const user = await User.findById({ _id: userId });
  sendEmail(
    user.email,
    "Password Reset Successfully",
    { name: user.username, changedPassword: password },
    "./template/resetPassword.handlebars"
  );
  return true;
};

const forgotPassword = async (userId, email) => {
  const hash = await bcrypt.hash(password, Number(bcryptSalt));
  await User.updateOne(
    { _id: userId },
    { email: email },
    { $set: { password: hash } }
  );
  const user = await User.findById({ _id: userId });
  sendEmail(
    user.email,
    "Password Reset Successfully",
    { name: user.username },
    "./template/resetPassword.handlebars"
  );
  return true;
};

module.exports = {
  loginUser,
  requestPasswordReset,
  resetPassword,
  changePassword,
  forgotPassword,
};
