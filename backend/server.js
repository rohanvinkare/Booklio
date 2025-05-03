require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/db-config.js");
const { connectRedis } = require('./cache/redis_config.js');

const app = express();
connectDB();

// Connecting to Redis
connectRedis();


app.set("view engine", "ejs");
app.set("views", "./views");


//========================================  Built-in Middleware

const bodyParser = require("body-parser");
app.use(express.json()); // Built-in JSON parser
app.use(bodyParser.json()); // Parses JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parses URL-encoded data

//----------------------------------------------------------------

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


// //---- Swagger Middleware
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger/swagger-output.json');
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// // Serves API documentation using Swagger UI at the /api-docs route

const setupSwagger = require("./config/swaggerConfig.js");

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


// Define the /health route
app.get('/health', (req, res) => {
  res.status(200).send('Hello Booklio!');
});


app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <style>
          body {
            background-color: black;
            color: white;
            display: flex;
            flex-direction: column;
            height: 100vh;
            justify-content: center;
            align-items: center;
            font-family: Arial, sans-serif;
            font-size: 2rem;
            text-align: center;
          }
          a {
            margin-top: 20px;
            color: #4CAF50;
            text-decoration: none;
            font-size: 1.2rem;
            border: 2px solid #4CAF50;
            padding: 10px 20px;
            border-radius: 5px;
            transition: 0.3s;
          }
          a:hover {
            background-color: #4CAF50;
            color: black;
          }
        </style>
      </head>
      <body>
        <div>
          <h1>Welcome to Booklio</h1>
          <p>Your go-to platform for book lovers</p>
          <a href="/api-docs">View API Documentation</a>
        </div>
      </body>
    </html>
  `);
});



setupSwagger(app);


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

