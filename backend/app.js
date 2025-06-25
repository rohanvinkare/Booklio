// app.js
require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/db-config.js");
const { connectRedis } = require('./cache/redis_config.js');

const app = express();

// Only connect DB and Redis if not in test mode
if (process.env.NODE_ENV !== 'test') {
  connectDB();
  connectRedis();
}

app.set("view engine", "ejs");
app.set("views", "./views");

const bodyParser = require("body-parser");
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require("cors");
app.use(cors());

const { logger, requestLogger } = require("./middleware/logger");
app.use(requestLogger);

const helmet = require("helmet");
app.use(helmet());

const setupSwagger = require("./config/swaggerConfig.js");

const userRoute = require("./routes/user-route.js");
const sellerRoute = require("./routes/seller-route.js");
const managementRoute = require("./routes/management/management-route.js");
const adminRoute = require("./routes/management/admin/admin-route.js");
const bookRoute = require("./routes/books-route.js");
const orderRoute = require("./routes/order-route.js");
const tokenRoute = require("./routes/token-route.js");

app.use("/", userRoute);
app.use("/", sellerRoute);
app.use("/", managementRoute);
app.use("/", adminRoute);
app.use("/", bookRoute);
app.use("/", orderRoute);
app.use("/", tokenRoute);

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
            <a href="https://booklio-backend.codenix.space/api-docs/">View API Documentation</a>
          </div>
        </body>
      </html
    `);
});


setupSwagger(app);

const errorHandler = require("./middleware/error-handler");
app.use(errorHandler);

module.exports = app;
