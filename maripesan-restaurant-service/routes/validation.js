import { body } from "express-validator";

const createRestaurantCategory = [
  body("category")
    .isString()
    .notEmpty()
    .withMessage("Category name is required"),
];

const createRestaurant = [
  body("name").isString().notEmpty().withMessage("Restaurant name is required"),
  body("address")
    .isString()
    .notEmpty()
    .withMessage("Restaurant address is required"),
];

const editRestaurant = [body("restaurantCategoryId").isInt()];

const createSchedule = [
  body("day").isString(),
  body("open").isString(),
  body("close").isString,
];

const createWithdraw = [
  body("amount").isInt(),
  body("bank").isString(),
  body("account_name").isString(),
  body("account_number").isString(),
];
const editWithdraw = [
  body("status").isString(),
  body("amount").optional({ checkFalsy: true }).isInt(),
];

const createMenuCategory = [
  body("category").notEmpty().isString(),
  body("number").notEmpty().isInt(),
];

const createMenu = [
  body("menuCategoryId").isInt(),
  body("name").isString(),
  body("price").isInt(),
  body("stok").isInt(),
];

export {
  createRestaurantCategory,
  createRestaurant,
  editRestaurant,
  createWithdraw,
  editWithdraw,
  createMenuCategory,
  createMenu,
  createSchedule,
};
