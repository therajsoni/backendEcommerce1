const express = require("express");
const {
  getAllproducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetailsOne,
  getProductReviews,
  deleteReview,
} = require("../controllers/productController");
const { isAuthenticateuser, authorizRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/products").get(getAllproducts);
router
  .route("/admin/product/new")
  .post(isAuthenticateuser, authorizRoles("admin"), createProduct);
router
  .route("/admin/product/:id")
  .put(isAuthenticateuser, authorizRoles("admin"), updateProduct)
  .delete(isAuthenticateuser, authorizRoles("admin"), deleteProduct);

router.route("/product/:id").get(getProductDetailsOne);
router.route('/review').put(isAuthenticateuser,createProduct)
router.route("/reviews").get(getProductReviews).delete(isAuthenticateuser,deleteReview)
module.exports = router;
