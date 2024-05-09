//mongosh "mongodb+srv://cluster0.elovarg.mongodb.net/" --apiVersion 1 --username <username>

//connection string //== mongodb+srv://<username>:<password>@cluster0.elovarg.mongodb.net/

const mongoose = require("mongoose");
// const autoIncrement = require('mongoose-auto-increment');

// const URI = "mongodb://127.0.0.1:27017/mern_admin"
const URI = process.env.MONGODB_URI;
//"mongodb+srv://janvi_rathod:123456789janvi@cluster0.gxugh0k.mongodb.net/Book_My_Meal-Admin?retryWrites=true&w=majority"
// mongoose.connect(URI)

const connectDB = async () => {
  try {
    await mongoose.connect(URI);
    const db = mongoose.connection;
    // autoIncrement.initialize(db);
    console.log("connected successfull with DATABASE");
  } catch (error) {
    console.error("database connection failed", error);
    process.exit(0);
  }
};
module.exports = connectDB;
