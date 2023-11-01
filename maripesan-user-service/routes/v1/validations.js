import { body } from "express-validator";

const createUser = [
  body("id")
    .exists({ checkFalsy: true })
    .withMessage("id is required")
    .isLength({ min: 1 }),
  body("name")
    .exists({ checkFalsy: true })
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),
  body("email").isEmail().withMessage("Email must be a valid email"),
  body("phone")
    .optional({ checkFalsy: true })
    .isMobilePhone("any", { strictMode: true })
    .withMessage("Please input a valid phone number, begin with +[LOCAL_CODE]"),
  body("imageUrl")
    .isString()
    .withMessage("Image url must be a string")
    .optional({ checkFalsy: true }),
  body("provider")
    .exists({ checkFalsy: true })
    .withMessage("Provider is required")
    .custom((value) => {
      if (!Array.isArray(value)) {
        throw new Error("Provider must be an array");
      }
      return true;
    }),
  body("googleId")
    .isString()
    .withMessage("GoogleId must be a string")
    .optional({ checkFalsy: true }),
  body("fcm")
    .isString()
    .withMessage("fcm must be a string")
    .optional({ checkFalsy: true }),
];

const updateUser = [
  body("roleId")
    .optional({ checkFalsy: true })
    .isInt()
    .withMessage("RoleId must be an integer"),
  body("name")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),
  body("email")
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage("Email must be a valid email"),
  body("phone")
    .optional({ checkFalsy: true })
    .isMobilePhone("any", { strictMode: true })
    .withMessage("Please input a valid phone number, begin with +[LOCAL_CODE]"),
  body("imageUrl").optional({ checkFalsy: true }),
  body("provider")
    .optional({ checkFalsy: true })
    .custom((value) => {
      if (!Array.isArray(value)) {
        throw new Error("Provider must be an array");
      }
      return true;
    }),
  body("googleId")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("GoogleId must be a string"),
  body("fcm")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("fcm must be a string"),
];

const createUserFavourite = [
  body("restaurantId")
    .exists({ checkFalsy: true })
    .withMessage("Restaurant id is required")
    .isInt()
    .withMessage("Restaurant id must be an integer"),
];

const createRole = [
  body("role")
    .exists({ checkFalsy: true })
    .withMessage("Role is required")
    .isString()
    .withMessage("Role must be a string"),
];

export { createUser, updateUser, createUserFavourite, createRole };
