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

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", cors());


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
            background-color: #000;
            color: #fff;
            display: flex;
            flex-direction: column;
            height: 100vh;
            justify-content: center;
            align-items: center;
            font-family: Arial, sans-serif;
            text-align: center;
          }

          h1 {
            font-size: 2.4rem;
            margin-bottom: 8px;
          }

          p {
            font-size: 1.2rem;
            opacity: 0.8;
          }

          .btn-container {
            display: flex;
            gap: 30px;
            margin-top: 30px;
          }

          .btn {
            padding: 14px 28px;
            border-radius: 8px;
            font-size: 1.2rem;
            font-weight: 600;
            text-decoration: none;
            color: black;
            transition: 0.25s;
          }

          .dev {
            background: #ff9800;
            border: 2px solid #ff9800;
          }

          .prod {
            background: #4caf50;
            border: 2px solid #4caf50;
          }

          .btn:hover {
            transform: scale(1.07);
            opacity: 0.9;
          }
        </style>
      </head>

      <body>
        <h1>Welcome to Booklio</h1>
        <p>Select your API environment</p>

        <div class="btn-container">
          <a class="btn dev" href="https://booklio-backend-dev.codenix.space/api-docs/">
            DEV Swagger
          </a>

          <a class="btn prod" href="https://booklio-backend.codenix.space/api-docs/">
            PROD Swagger
          </a>
        </div>

      </body>
    </html>
  `);
});



setupSwagger(app);

const errorHandler = require("./middleware/error-handler");
app.use(errorHandler);

module.exports = app;
