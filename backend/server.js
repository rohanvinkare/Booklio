require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db-config.js");
// Adds security-related headers


const app = express();
connectDB();

app.set("view engine", "ejs");
app.set("views", "./views");

//======================================= Error Handling Middleware

const errorHandler = require("./middleware/error-handler");
// use at last  app.use(errorHandler);
//---------------------------------------


//======================================= Application Middleware

//---- CORS Middleware
const cors = require("cors");
app.use(cors()); // Enables Cross-Origin Resource Sharing 

//---- Morgan Middleware
const { logger, requestLogger } = require("./middleware/logger");
app.use(requestLogger);

//---- Helmet Middleware
const helmet = require("helmet");
app.use(helmet());

//---- Swagger Middleware
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger-output.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Serves API documentation using Swagger UI at the /api-docs route

//----------------------------------------------------------------



//========================================  Built-in Middleware

const bodyParser = require("body-parser");
app.use(express.json()); // Built-in JSON parser
app.use(bodyParser.json()); // Parses JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parses URL-encoded data

//----------------------------------------------------------------

const userRoute = require("./routes/user-route.js");
const sellerRoute = require("./routes/seller-route.js");
const managementRoute = require("./routes/management/management-route.js");
const adminRoute = require("./routes/management/admin/admin-route.js");
const bookRoute = require("./routes/books-route.js");
const orderRoute = require("./routes/order-route.js");
const tokenRoute = require("./routes/token-route.js")

app.use("/", userRoute);
app.use("/", sellerRoute);
app.use("/", managementRoute);
app.use("/", adminRoute);
app.use("/", bookRoute);
app.use("/", orderRoute);
app.use("/", tokenRoute);

app.get("/", (req, res) => {
  res.send("Booklio Successfully running ");
});


// 🔹 Global Error Handler (Dynamic)
app.use(errorHandler);
// Add in the catch block of the async function
/*
catch (error) {
    next(error); // ✅ Sends error to the global handler
}
*/



app.listen(process.env.PORT || 3000, "0.0.0.0", () => {
  console.log(`Server is Running on http://localhost:${process.env.PORT}`);
  console.log(`Api Doc http://localhost:${process.env.PORT}/api-docs`);
});
