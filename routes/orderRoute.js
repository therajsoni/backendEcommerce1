const express = require("express")
const router = express.Router()

const {isAuthenticateuser,authorizRoles} = require("../middleware/auth");
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require("../controllers/orderController");

router.route("/order/new").post(isAuthenticateuser,newOrder);
router.route("/order/:id").get(isAuthenticateuser,getSingleOrder);
router.route("/orders/me").get(isAuthenticateuser,myOrders);
router.route("/admin/orders").get(isAuthenticateuser,authorizRoles("admin"),getAllOrders);
router.route("/admin/order/:id").put(isAuthenticateuser,authorizRoles("admin"),updateOrder).delete(isAuthenticateuser,authorizRoles("admin"),deleteOrder)

module.exports = router;
