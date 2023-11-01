import express from "express";
import {
  viewOrders,
  viewCurrentUserOrders,
  createOrder,
  callbackOrder,
  editOrder,
  deleteOrder,
  getSummaryOrder,
} from "./handlers/order.js";
import {
  createOrderDetails,
  getAmountSold,
  editOrderDetails,
  viewOrderDetailById,
  viewOrderDetails,
} from "./handlers/order_detail.js";
import {
  createPayment,
  viewPayment,
  viewPaymentById,
} from "./handlers/payment.js";
import { validate } from "./helpers/validate.js";
import * as validation from "./validation.js";
import checkToken from "../../middlewares/check-token.js";
import {
  checkMitraRole,
  checkAdminRole,
  checkAllRole,
} from "../../middlewares/check-role.js";

const router = express.Router();

router.get("/orders/payment", checkToken, checkAdminRole, viewPayment);
// ORDER SUMMARY
router.get(
  "/orders/summary/:restaurant_id",
  checkToken,
  checkMitraRole,
  getSummaryOrder
);

router.get(
  "/orders/order-details",
  checkToken,
  checkAdminRole,
  viewOrderDetails
);

// ORDERS
router.post(
  "/orders",
  checkToken,
  validation.createOrder,
  validate,
  createOrder
);
router.get("/orders/payments/callback", callbackOrder); // not in api gateway
router.get("/orders/:restaurants_id", checkToken, checkMitraRole, viewOrders);
router.put("/orders/:id", checkToken, checkAllRole, editOrder);
router.delete("/orders/:id", checkToken, checkAllRole, deleteOrder);

// ORDER DETAILS
router.get("/order-details/amount-sold", getAmountSold);
router.get(
  "/orders/order-details/:id",
  checkToken,
  checkAdminRole,
  viewOrderDetailById
);
router.post(
  "/orders/:id/details",
  checkToken,
  validation.createOrderDetail,
  validate,
  createOrderDetails
);
router.put("/orders/:id/details/:id_detail", checkToken, editOrderDetails);

// PAYMENT
router.post(
  "/orders/:order_id/payments",
  checkToken,
  validation.createPayment,
  validate,
  createPayment
);
router.get("/orders/payment/:id", checkToken, checkAdminRole, viewPaymentById);

router.get("/me/orders", checkToken, viewCurrentUserOrders);

export default router;
