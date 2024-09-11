const ErrorHandler = require("../utils/errorHandle.js");
const catchAsyncError = require("../middleware/AsyncRequiredError.js");
const User = require("../models/UserModel.js");
const sendToken = require("../utils/jwtToken.js");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto");

//register a User

exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this is a sample id",
      url: "profilepicUrl",
    },
  });

  const token = user.getJWTToken();

  res.status(201).json({
    success: true,
    token,
  });
});

// Login User
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  // checking if user has given password and email both
  if (!email || !password) {
    return next(new Error("email or password not valid", 400));
  }

  const user = await User.findOne({ email: email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("invalid email or password"));
  }

  const isPasswordMatched = user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("invalid password not matched", 401));
  }

  // const token = user.getJWTToken();

  // res.status(200).json({
  //   sucess: true,
  //   token,
  // });

  sendToken(user, 200, res);
});

// LOGOUT USER

exports.logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("user not found", 404));
  }

  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;
  // learn to know about it!
  const message = `Your password reset token is : -\n\n ${resetPasswordUrl} \n\n If you haven't requested this email then , please ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Ecommerce Password Recovery",
      message,
    });

    res.status(200).json({
      sucess: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    // save ko un Save karte hai

    // change value

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // save

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 404));
  }
});

//Reset Password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save(); // { validateBeforeSave: false }

  sendToken(user, 200, res);
});
// ------------------------------------Authntiction----------------

// Get User Detail
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  // login Authtication -- login ho tabhi user access kar sake
  //  ki need nhi hai if(!user) {

  res.status(200).json({
    success: true,
    user,
  });
});

// update User detail
exports.updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  // login Authtication -- login ho tabhi user access kar sake
  //  ki need nhi hai if(!user) {

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("not Matched", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  // res.status(200).json({
  //   success: true,
  //   user,
  // });

  sendToken(user, 2000, res);
});

//update User Profile
exports.updateProfile = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  // we'll update profile
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runvalidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Get all users for show able it here Admin
exports.getAlluser = catchAsyncError(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});

//admin want to show one of sigal user detail Admin
exports.getOneuserDetail = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }
  res.status(200).json({
    success: true,
    user,
  });
});

//update User Role
exports.updateRoleOfUserByAdmin = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  // we'll update profile
  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runvalidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

//update User Profile
exports.deleteUserByAdmin = catchAsyncError(async (req, res, next) => {
  // we'll delete profile

  const user = await User.findById(req.user.id); // req.user.id it is wrong because users current is
  // admin then admin is delete or update that time
  // req.user.id is admin id not user id so
  // req.params.id -- it is correct

  await User.deleteOne(user);

  res.status(200).json({
    success: true,
  });
});
