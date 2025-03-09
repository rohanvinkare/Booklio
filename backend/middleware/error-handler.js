const errorHandler = (err, req, res, next) => {
    console.error(err); // Log error for debugging
  
    // Use provided status code or default to 500
    const statusCode = err.statusCode || err.status || 500;
  
    // Use provided message or default to a generic error message
    const message = err.message || "Something went wrong! Please try again.";
  
    // Send the error response
    res.status(statusCode).json({ success: false, message });
  };
  
  module.exports = errorHandler;
  