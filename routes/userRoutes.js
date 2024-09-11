const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAlluser,
  getOneuserDetail,
  updateRoleOfUserByAdmin,
  deleteUserByAdmin,
} = require("../controllers/userController");
const { isAuthenticateuser, authorizRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/logout").get(logout);

router.route("/me").get(isAuthenticateuser, getUserDetails);

router.route("/password/update").put(isAuthenticateuser, updatePassword);

router.route("/me/update").put(isAuthenticateuser, updateProfile);

router
  .route("/admin/users")
  .get(isAuthenticateuser, authorizRoles("admin"), getAlluser);

router
  .route("/admin/user/:id")
  .get(isAuthenticateuser, authorizRoles("admin"), getOneuserDetail)
  .put(isAuthenticateuser, authorizRoles("admin"), updateRoleOfUserByAdmin)
  .delete(isAuthenticateuser, authorizRoles("admin"), deleteUserByAdmin);

module.exports = router;
