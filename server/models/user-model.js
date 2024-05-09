const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

// Define the sequence schema
const sequenceSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence_value: { type: Number, default: 2000 }
});

// Create the Sequence model
const Sequence = mongoose.model('Sequence', sequenceSchema);

// Define the User schema
const userSchema = new mongoose.Schema(
  {
    code: {
      type: Number,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isEmployee: {
      type: Boolean,
      default: false,
    },
    department: {
      type: String,
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    next();
  }
  try {
    const saltRound = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(user.password, saltRound);
    user.password = hash_password;
  } catch (error) {
    next(error);
  }
});

userSchema.pre('save', async function(next) {
  const doc = this;
  if (!doc.code) {
      try {
          // Find and increment the sequence value
          const sequence = await Sequence.findByIdAndUpdate(
              { _id: 'userId' },
              { $inc: { sequence_value: 1 } },
              { new: true, upsert: true }
          );
          doc.code = sequence.sequence_value;
          next();
      } catch (error) {
          return next(error);
      }
  } else {
      next();
  }
});

//compare password
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// json web token
userSchema.methods.generateToken = async function () {
  try {
    return jwt.sign(
      {
        userId: this._id.toString(),
        email: this.email,
        isAdmin: this.isAdmin,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "30d",
      }
    );
  } catch (error) {
    console.error("Token Error: ", error);
  }
};

//compare password for login
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// define the model or the collection name
const User = new mongoose.model("User", userSchema);
module.exports = User;
