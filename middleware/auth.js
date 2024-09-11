const User = require("../models/UserModel");
const ErrorHandler = require("../utils/errorHandle");
const AsyncRequiredError = require("./AsyncRequiredError");
const jwt = require("jsonwebtoken");

const isAuthenticateuser = AsyncRequiredError(async (req, res, next) => {
  const { token } = req.cookies; // cookies send only and only

  if (!token) {
    return next(new ErrorHandler("Please Login to access this resource", 401));
  }

  const decodedData = jwt.verify(token, process.env.SECRET_KEY);

  req.user = await User.findById(decodedData.id);

  next();
});

const authorizRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role : ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};

module.exports = { isAuthenticateuser, authorizRoles };
