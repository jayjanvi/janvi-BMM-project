require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const router = require("./router/auth-router");
const connectDB = require("./db");
const errorMiddleware = require("./middlewares/error-middleware");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use("/api/auth", router);
app.use(errorMiddleware);

const PORT = 5000;

(async function db() {
  await connectDB();
})();

app.use((error, req, res, next) => {
  res.status(500).json({ error: error.message });
});

app.listen(PORT, () => {
  console.log("Listening to Port ", PORT);
});

// connectDB().then(() => {
//   app.listen(PORT, () => {
//     console.log(`server is running at port: ${PORT}`);
//   });
// });

// app.get("/", (req, res) => {
//     res.send("hello welcome")
// })

// app.get("/register", (req, res) => {
//     res.send(" welcome to registration page")
// })

module.exports = app;