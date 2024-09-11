const ErrorHandler = require("../utils/errorHandle.js");

module.exports = (error, req, res, next) => {
  console.log(error);
  error.statusCode = error.statusCode || 500;
  error.message = error.message || "Internal Server Error";

  // mongoDB id it is called Cast error and it is _--2type_-- error

  if (error.name === "CastError") {
    const message = `Resource not found . Invalid : ${error.path}`;
    error = new ErrorHandler(message, 400);
    // it isn't end the server
  }

  //MongoDB  duplicate key when send again and agin same emial
  if (error.code === 11000) {
    const message = `Duplicate field value entered for : ${Object.keys(
      error.keyValue
    )} `;
    error = new ErrorHandler(message, 4000);
  }

  // Wrong JWT Error
  if (error.name === "JsonWebTokenError") {
    const message = "Your token is invalid . Please log in again ";
    error = new ErrorHandler(message, 4000);
  }

  //JWT EXPIRE ERROR
  if (error.name === "TokenExpiredError") {
    const message = "Your token has expired . Please log in again ";
    error = new ErrorHandler(message, 4000);
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
  });
};

// no matter from ErrorHandler class
// -- it is use for product not found that time use it  !product reasons that when id wrong as reasons
