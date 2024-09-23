const jwt = require("jsonwebtoken");
const Blacklist = require("../models/blacklist-model");

const verifyToken = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["authorization"];

  if (!token) {
    return res.status(403).json({
      success: false,
      msg: "A Token is requierd for Authentication ",
    });
  }

  try {
    const bearer = token.split(" ");
    const bearerToken = bearer[1];

    const blacklistedToken = await Blacklist.findOne({ token: bearerToken });

    if (blacklistedToken) {
      return res.status(400).json({
        success: false,
        msg: "This Session Has expired, please login again!",
      });
    }

    const decodedData = jwt.verify(
      bearerToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    // Attaching the data with the req
    req.cred = decodedData;
  } catch (error) {
    return res.status(401).json({
      success: false,
      msg: "Invalid token",
    });
  }

  return next();
};

module.exports = verifyToken;
