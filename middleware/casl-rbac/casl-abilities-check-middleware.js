const { ForbiddenError } = require("@casl/ability");

/**
 * Middleware to check abilities
 * action can be CURD
 * and subject can be Role
 *
 */

function checkAbility(action, subject) {
  return (req, res, next) => {
    try {
      ForbiddenError.from(req.ability).throwUnlessCan(action, subject);
      next();
    } catch (error) {
      res.status(403).json({ message: "Access Denied!" });
    }
  };
}

// Centralized error handling middleware
function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
}

module.exports = { checkAbility, errorHandler };
