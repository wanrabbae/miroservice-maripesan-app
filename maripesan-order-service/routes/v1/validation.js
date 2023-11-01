import { body } from "express-validator";

const createOrder = [
  body("userId").notEmpty().withMessage("userId is required"),
  body("restaurantId").notEmpty().withMessage("restaurantId is required"),
  body("restaurantId").isInt().withMessage("restaurantId must be an integer"),
  body("total").notEmpty().withMessage("total is required"),
  body("total").isInt().withMessage("total must be an integer"),
  body("type").notEmpty().withMessage("type is required"),
];

const editOrder = [
  body("total").isInt().withMessage("total must be an integer"),
];

const createOrderDetail = [
  body("userId").notEmpty().withMessage("userId is required"),
  body("menuId").notEmpty().withMessage("menuId is required"),
  body("menuId").isInt().withMessage("userId must be an integer"),
];

const createPayment = [
  body("paymentMethod").notEmpty().withMessage("paymentMethod is required"),
  body("userId").notEmpty().withMessage("userId is required"),
  body("invoiceId").notEmpty().withMessage("invoiceId is required"),
  body("invoiceId").isInt().withMessage("invoiceId must be an integer"),
  body("total").notEmpty().withMessage("total is required"),
  body("total").isInt().withMessage("total must be an integer"),
];

export { createOrder, editOrder, createOrderDetail, createPayment };
