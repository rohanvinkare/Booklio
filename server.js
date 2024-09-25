require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db-config.js");

const userRoute = require("./routes/user-route.js");
const booksRoute = require('./routes/book-route.js')

const app = express();
connectDB();

const path = require('path');
app.use(express.static(path.join(__dirname,"public")));
app.set("view engine", "ejs");
app.set("views", "./views");

app.use("/", userRoute);
app.use("/", booksRoute)

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is Running on http://localhost:${process.env.PORT}`);
});