const jwt = require("jsonwebtoken");
const Blacklist = require("../models/blacklist-model");

const {
  defineAbilitiesFor,
} = require("../controllers/casl-rbac/casl-abilities");

/**
 * Token
 */

const verifyToken = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["authorization"];

  if (!token) {
    return res.status(403).json({
      success: false,
      msg: "A Token is requierd for Authentication ",
    });
  }

  //*************** For Token Decode *********

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

  //*************** For attaching the ability's to req *********

  try {
    // Ensure req.cred is set by the auth middleware (token decoding)
    if (!req.cred) {
      return res.status(401).json({
        success: false,
        msg: "Credentials not found. Authentication required.",
      });
    }

    // Define and attach abilities based on the user role
    req.ability = defineAbilitiesFor(req.cred.credDecode);
    console.log(req.ability);
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: error.message || "An error occurred while processing abilities.",
    });
  }

  return next();
};

module.exports = verifyToken;
