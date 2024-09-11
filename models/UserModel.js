const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");// resetPassword


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name can't exceed 30 character"],
    maxLength: [30, "maxLength is 30"],
    minLength: [2, "minLength character 3"],
  },
  email: {
    type: String,
    required: [true, "please provide email"],
    validate: [validator.isEmail, "please provide valid email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "please provide password"],
    minLength: [8, "minLength character 8"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// JWT
const secretKey = process.env.SECRET_KEY;

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, secretKey, {
    expiresIn: process.env.ExpireIn,
  });
};

userSchema.methods.comparePassword = (enterPassword) => {
  return bcrypt.compare(enterPassword, this.password);
};

// Generating Password for Rest Token
userSchema.methods.getResetPasswordToken = function () {
  // generating token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and add new Token resetPasswordToken to userSchema

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
