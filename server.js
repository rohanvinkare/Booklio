require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db-config.js");
const cors = require("cors");

const app = express();
connectDB();

app.use(cors());

app.set("view engine", "ejs");
app.set("views", "./views");

const userRoute = require("./routes/user-route.js");
const sellerRoute = require("./routes/seller-route.js");
const managementRoute = require("./routes/management/management-route.js");
const adminRoute = require("./routes/management/admin/admin-route.js");
const bookRoute = require("./routes/books-route.js");
const orderRoute = require("./routes/order-route.js");

app.use("/", userRoute);
app.use("/", sellerRoute);
app.use("/", managementRoute);
app.use("/", adminRoute);
app.use("/", bookRoute);
app.use("/", orderRoute);

app.get("/", (req, res) => {
  res.send("Booklio Successfully running ");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is Running on ${process.env.PORT}`);
});
