require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db-config.js");

const app = express();
connectDB();

app.set("view engine", "ejs");
app.set("views", "./views");

const userRoute = require("./routes/user-route.js");
const sellerRoute = require("./routes/seller-route.js");
app.use("/", userRoute);
app.use("/", sellerRoute);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is Running on ${process.env.PORT}`);
});
