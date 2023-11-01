import { body } from "express-validator";

const cartValidation = [
  body("restaurantId")
    .exists({ checkFalsy: true })
    .withMessage("Restaurant id is required")
    .isInt()
    .withMessage("Restaurant id must be an integer"),
  body("type")
    .isString()
    .isIn(["dinein", "takeaway"])
    .withMessage("Type must be dinein or takeaway"),
];

const editCartDetailsValidation = [body("quantity").isInt()];

const createCartDetailsValidation = [
  body("menuId").isInt(),
  body("quantity").isInt(),
];

export {
  cartValidation,
  editCartDetailsValidation,
  createCartDetailsValidation,
};
