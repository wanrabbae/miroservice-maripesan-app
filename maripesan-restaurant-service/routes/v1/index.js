import express from "express";
import { validate } from "./helpers/validate.js";
import * as validation from "../validation.js";
import filterFile from "./helpers/filter-file.js";
import checkToken from "../../middlewares/check-token.js";
import {
  checkAdminRole,
  checkMitraRole,
  checkAllRole,
} from "../../middlewares/check-role.js";

import {
  viewRestaurantCategories,
  viewRestaurantCategoryById,
  createRestaurantCategory,
  deleteRestaurantCategory,
  updateRestaurantCategory,
} from "./handlers/restaurant_categories.js";
import {
  viewRestaurants,
  viewRestaurantId,
  createRestaurant,
  editRestaurant,
  deleteRestaurant,
  checkRestaurantSchedule,
} from "./handlers/restaurant.js";
import {
  editSchedule,
  viewSchedules,
  createSchedule,
  viewScheduleById,
  deleteScheduleById,
} from "./handlers/restaurant_schedule.js";
import {
  viewWithdraw,
  viewWithdrawId,
  createWithdraw,
  editWithdraw,
  deleteWithdraw,
} from "./handlers/withdraw.js";
import {
  viewMenuCategories,
  viewMenuCategoryById,
  createMenuCategory,
  editMenuCategory,
  deleteMenuCategory,
} from "./handlers/menu_categories.js";
import {
  viewMenu,
  allMenu,
  viewMenuId,
  createMenu,
  editMenu,
  deleteMenu,
  updateAllPriceMenuWithPercentage,
} from "./handlers/menu.js";

import {
  viewPhotos,
  viewPhotoById,
  createPhotos,
  deletePhoto,
  updatePhoto,
} from "./handlers/restaurant_photos.js";

const router = express.Router();

// UPDATE ALL MENU WIRH PERCENTAGE
router.put(
  "/restaurants/menu-percentage/:restaurantId",
  checkToken,
  checkMitraRole,
  updateAllPriceMenuWithPercentage
);

// Restaurant
router.get("/restaurants", viewRestaurants);
router.post(
  "/restaurants/menu",
  checkToken,
  checkMitraRole,
  filterFile.single("thumbnail"),
  validation.createMenu,
  validate,
  createMenu
);
router.get("/restaurants/withdraw", checkToken, checkMitraRole, viewWithdraw);
router.get("/restaurants/schedule", checkToken, checkAdminRole, viewSchedules);
router.get("/restaurants/categories", viewRestaurantCategories);
router.get("/restaurants/all-menus", allMenu);

router.get("/restaurants/:id", viewRestaurantId);
router.get("/restaurants/:id/schedule", checkRestaurantSchedule);
router.post(
  "/restaurants",
  filterFile.single("thumbnail"),
  validation.createRestaurant,
  validate,
  createRestaurant
);
router.put(
  "/restaurants/:id",
  checkToken,
  checkMitraRole,
  filterFile.single("thumbnail"),
  validation.editRestaurant,
  validate,
  editRestaurant
);
router.delete("/restaurants/:id", checkToken, checkAdminRole, deleteRestaurant);

// Restaurant Categories
router.post(
  "/restaurants/categories",
  checkToken,
  checkMitraRole,
  filterFile.single("imageUrl"),
  validation.createRestaurantCategory,
  validate,
  createRestaurantCategory
);
router.get("/restaurants/categories/:id", viewRestaurantCategoryById);
router.delete(
  "/restaurants/categories/:id",
  checkToken,
  checkMitraRole,
  deleteRestaurantCategory
);
router.put(
  "/restaurants/categories/:id",
  checkToken,
  checkMitraRole,
  filterFile.single("imageUrl"),
  updateRestaurantCategory
);

// Restaurant schedule
router.post(
  "/restaurants/:restaurant_id/schedule",
  checkToken,
  checkMitraRole,
  validation.createSchedule,
  createSchedule
);
router.get(
  "/restaurants/:restaurant_id/schedule/:schedule_id",
  checkToken,
  checkMitraRole,
  viewScheduleById
);
router.put(
  "/restaurants/:restaurant_id/schedule/:schedule_id",
  checkToken,
  checkMitraRole,
  editSchedule
);
router.delete(
  "/restaurants/:restaurant_id/schedule/:schedule_id",
  checkToken,
  checkMitraRole,
  deleteScheduleById
);

// Withdraw
router.get(
  "/restaurants/withdraw/:id",
  checkToken,
  checkMitraRole,
  viewWithdrawId
);
router.post(
  "/restaurants/:id/withdraw",
  checkToken,
  checkMitraRole,
  validation.createWithdraw,
  validate,
  createWithdraw
);
router.put(
  "/restaurants/withdraw/:id",
  checkToken,
  checkAdminRole,
  filterFile.single("imageUrl"),
  validation.editWithdraw,
  validate,
  editWithdraw
);
router.delete(
  "/restaurants/withdraw/:id",
  checkToken,
  checkAdminRole,
  deleteWithdraw
);

// Menu categories
router.get("/restaurants/:id/menu-categories", viewMenuCategories);
router.get("/restaurants/menu-categories/:id", viewMenuCategoryById);
router.post(
  "/restaurants/:id/menu-categories",
  checkToken,
  checkMitraRole,
  validation.createMenuCategory,
  createMenuCategory
);
router.put(
  "/restaurants/menu-categories/:id",
  checkToken,
  checkMitraRole,
  editMenuCategory
);
router.delete(
  "/restaurants/menu-categories/:id",
  checkToken,
  checkMitraRole,
  deleteMenuCategory
);

// Menu
router.get("/restaurants/:id/menu", viewMenu);
router.get("/restaurants/:id/menu/:id_menu", viewMenuId);
router.put(
  "/restaurants/menu/:id",
  checkToken,
  filterFile.single("thumbnail"),
  editMenu
);
router.delete("/restaurants/menu/:id", checkToken, checkMitraRole, deleteMenu);

// restaurant photos / thumbnails
router.get("/restaurants/:id/thumbnails", viewPhotos);
router.get("/restaurants/:id/thumbnails/:id_thumb", viewPhotoById);
router.post(
  "/restaurants/:id/thumbnails",
  checkToken,
  checkMitraRole,
  filterFile.single("thumbnail"),
  createPhotos
);
router.put(
  "/restaurants/:id/thumbnails/:id_thumb",
  checkToken,
  checkMitraRole,
  filterFile.single("thumbnail"),
  updatePhoto
);
router.delete(
  "/restaurants/:id/thumbnails/:id_thumb",
  checkToken,
  checkMitraRole,
  deletePhoto
);

export default router;
