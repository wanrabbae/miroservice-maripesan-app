import { body } from "express-validator";

const createVoucher = [
  body("restaurantId").isInt(),
  body("code").isString(),
  body("value").isInt(),
  body("minTransaction").isInt(),
  body("maxReduction").isInt(),
  body("quota").isInt(),
];

const editVoucher = [
  body("restaurantId").optional({ checkFalsy: true }).isInt(),
  body("code").optional({ checkFalsy: true }).isString(),
  body("value").optional({ checkFalsy: true }).isInt(),
  body("minTransaction").optional({ checkFalsy: true }).isInt(),
  body("maxReduction").optional({ checkFalsy: true }).isInt(),
  body("quota").optional({ checkFalsy: true }).isInt(),
];

const createBank = [body("name").isString()];

const editBank = [body("name").isString()];

export { createVoucher, editVoucher, createBank, editBank };
