const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
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

    const decodedData = jwt.verify(
      bearerToken,
      process.env.ACCESS_TOKEN_SECRET
    );
    
    // Attaching the data with the req  
    req.user = decodedData;


  } catch (error) {
    return res.status(401).json({
      success: false,
      msg: "Invalid token",
    });
  }

  return next();
};

module.exports = verifyToken;
