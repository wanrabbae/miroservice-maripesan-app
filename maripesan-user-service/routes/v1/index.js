import express from "express";
import checkId from "./middlewares/check-id.js";
import checkValidation from "./middlewares/check-validation.js";
import filterFile from "./helpers/filter-file.js";
import checkToken from "../../middlewares/check-token.js";

import * as validation from "./validations.js";
import {
  index,
  show,
  update,
  store,
  deleteUser,
  getCurrentUser,
  getCurrentUserFavourite,
  getUserRole,
  createUserRole,
  getUserFavourite,
  createUserFavourite,
  deleteUserFavourite,
  getAllRole,
  checkUserPhone,
} from "./handlers/index.js";

const router = express.Router();

router.get("/users", checkToken, index);
router.post(
  "/users",
  checkToken,
  filterFile.single("imageUrl"),
  validation.createUser,
  checkValidation,
  store
);
router.get("/users/phone", checkUserPhone);
router.get("/users/:id", checkToken, show);
router.put(
  "/users/:id",
  checkToken,
  filterFile.single("imageUrl"),
  validation.updateUser,
  checkValidation,
  update
);
router.delete("/users/:id", checkToken, deleteUser);

router.get("/users/:id/favourites", checkToken, getUserFavourite);
router.post(
  "/users/:id/favourites",
  checkToken,
  validation.createUserFavourite,
  checkValidation,
  createUserFavourite
);
router.delete(
  "/users/favourites/:id",
  checkToken,
  checkId,
  deleteUserFavourite
);

router.get("/me", checkToken, getCurrentUser);
router.get("/me/favourites", checkToken, getCurrentUserFavourite);
router.get("/users/:id/role", getUserRole);
router.post(
  "/roles",
  checkToken,
  validation.createRole,
  checkValidation,
  createUserRole
);
router.get("/roles", checkToken, getAllRole);

export default router;
