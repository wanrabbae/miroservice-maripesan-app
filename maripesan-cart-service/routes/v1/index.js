import express from "express";
import checkValidation from "./middlewares/check-validation.js";
import checkId from "./middlewares/check-id.js";
import * as validation from "./validations.js";
import {
  getCurrentUserCarts,
  viewAllCarts,
  viewAllCartDetails,
  viewAllCartShares,
  viewCart,
  createCart,
  updateCart,
  deleteCart,
  editCartDetails,
  deleteCartDetails,
  createCartDetails,
  createCartShares,
  editCartShares,
  deleteCartShares,
  checkCartSharesActiveLimt,
} from "./handlers/index.js";
import { checkAdminRole } from "../../middlewares/check-role.js";

const router = express.Router();

// Router Cart
router.get("/carts", viewAllCarts);
router.get("/carts/shares", checkAdminRole, viewAllCartShares);
router.get("/carts/details", checkAdminRole, viewAllCartDetails);
router.get("/carts/:id", checkId, viewCart);
router.post("/carts", validation.cartValidation, checkValidation, createCart);
router.put("/carts/:id", checkId, updateCart);
router.delete("/carts/:id", checkId, deleteCart);

// ROuter Cart Details
router.put(
  "/carts/details/:id",
  validation.editCartDetailsValidation,
  checkId,
  checkValidation,
  editCartDetails
);
router.delete("/carts/details/:id", checkId, deleteCartDetails);
router.post(
  "/carts/:id_cart/details/",
  validation.createCartDetailsValidation,
  checkValidation,
  createCartDetails
);

// cart shares
router.post("/carts/:id/shares", checkValidation, checkId, createCartShares);
router.delete("/carts/shares/:id", checkAdminRole, checkId, deleteCartShares);
router.put("/carts/shares/:id", checkAdminRole, checkId, editCartShares);
router.get("/check-cart/:id", checkId, checkCartSharesActiveLimt);

// me
router.get("/me/carts", getCurrentUserCarts);

export default router;
