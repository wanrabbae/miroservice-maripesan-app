import express from "express";
import { validate } from "./helpers/validate.js";
import {
  viewVoucher,
  viewVoucherId,
  applyVoucher,
  createVoucher,
  editVoucher,
  deleteVoucher,
} from "./handlers/voucher.js";
import {
  viewBanner,
  viewBannerId,
  createBanner,
  editBanner,
  deleteBanner,
} from "./handlers/banner.js";
import {
  viewBank,
  viewBankId,
  createBank,
  editBank,
  deleteBank,
} from "./handlers/bank.js";
import {
  viewBufferGlobal,
  editBufferGlobal,
} from "./handlers/buffer-global.js";
import * as validation from "./validation.js";
import filterFile from "./helpers/filter-file.js";
import checkToken from "../../middlewares/check-token.js";
import {
  checkMitraRole,
  checkAdminRole,
} from "../../middlewares/check-role.js";

import { viewWithdrawCut, editWithdrawCut } from "./handlers/withdraw-cut.js";
import {
  viewTag,
  viewTagId,
  createTag,
  editTag,
  deleteTag,
} from "./handlers/tag.js";
import {
  viewRestaurantTag,
  createRestaurantTag,
  deleteRestaurantTag,
} from "./handlers/restaurant-tag.js";
const router = express.Router();

// Voucher
router.get("/vouchers", checkToken, viewVoucher);
router.post(
  "/vouchers",
  checkToken,
  checkMitraRole,
  validation.createVoucher,
  validate,
  createVoucher
);
router.get("/vouchers/apply", checkToken, applyVoucher);
router.get("/vouchers/:id", checkToken, viewVoucherId);
router.put(
  "/vouchers/:id",
  checkToken,
  checkMitraRole,
  validation.editVoucher,
  validate,
  editVoucher
);
router.delete("/vouchers/:id", checkToken, checkMitraRole, deleteVoucher);

// Banner
router.get("/banners", viewBanner); //no token
router.post(
  "/banners",
  checkToken,
  checkAdminRole,
  filterFile.single("file"),
  createBanner
);
router.get("/banners/:id", viewBannerId); //no token
router.put(
  "/banners/:id",
  checkToken,
  checkAdminRole,
  filterFile.single("file"),
  editBanner
);
router.delete("/banners/:id", checkToken, checkAdminRole, deleteBanner);

// Bank
router.get("/banks", viewBank); //no token
router.post(
  "/banks",
  checkToken,
  checkAdminRole,
  filterFile.single("file"),
  validation.createBank,
  validate,
  createBank
);
router.get("/banks/:id", viewBankId);
router.put(
  "/banks/:id",
  checkToken,
  checkAdminRole,
  filterFile.single("file"),
  validation.editBank,
  validate,
  editBank
);
router.delete("/banks/:id", checkToken, checkAdminRole, deleteBank);

// Buffer Global
router.get("/buffers", viewBufferGlobal);
router.put("/buffers", checkToken, checkAdminRole, editBufferGlobal);

// Withdraw Cut
router.get("/withdraw-cuts", checkToken, viewWithdrawCut);
router.put("/withdraw-cuts", checkToken, checkAdminRole, editWithdrawCut);

// Tag
router.get("/tags", viewTag); //no token
router.post("/tags", checkToken, checkAdminRole, createTag);
router.get("/tags/:id", viewTagId); //no token
router.put("/tags/:id", checkToken, checkAdminRole, editTag);
router.delete("/tags/:id", checkToken, checkAdminRole, deleteTag);

// Restaurant Tag
router.get("/restaurant-tags", viewRestaurantTag); //no token
router.post(
  "/restaurant-tags",
  checkToken,
  checkAdminRole,
  createRestaurantTag
);
router.delete(
  "/restaurant-tags/:id",
  checkToken,
  checkAdminRole,
  deleteRestaurantTag
);

export default router;
