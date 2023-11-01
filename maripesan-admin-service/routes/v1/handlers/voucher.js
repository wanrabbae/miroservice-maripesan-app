import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import { getRestaurantById } from "../services/restaurant.js";

const prisma = new PrismaClient();

// Voucher
const viewVoucher = async (req, res, next) => {
  try {
    const query = await prisma.voucher.findMany();

    return res.json({
      status: "success",
      message: "Data Showed",
      data: query,
    });
  } catch (error) {
    next(error);
  }
};

const viewVoucherId = async (req, res, next) => {
  const restaurant_id = parseInt(req.params.id);

  try {
    if (restaurant_id == null) {
      return res.status(409).json({
        status: "error",
        message: "ID cannot be NULL",
      });
    }

    const query = await prisma.voucher.findMany({
      where: { restaurant_id: restaurant_id },
    });

    return res.json({
      status: "success",
      message: `Showed id: ${restaurant_id}`,
      data: query,
    });
  } catch (error) {
    next(error);
  }
};

const applyVoucher = async (req, res, next) => {
  const { voucher } = req.query;

  try {
    if (voucher == null || voucher == undefined) {
      return res.status(409).json({
        status: "error",
        message: "Voucher cannot be NULL",
      });
    }

    const query = await prisma.voucher.findFirst({
      where: { code: voucher },
    });

    const getRestaurantData = await getRestaurantById(query.restaurantId);
    let { name, thumbnail, active, description } = getRestaurantData;
    query.restaurantData = {
      name,
      thumbnail,
      active,
      description,
    };

    const now = new Date();
    const expiredDate = new Date(query.expired);

    if (!query) {
      return res.status(409).json({
        message: "Voucher not valid!",
        applied: false,
      });
    } else if (query.quota == 0) {
      return res.status(409).json({
        message: "Voucher is used!",
        applied: false,
      });
    } else if (now > expiredDate) {
      return res.status(409).json({
        message: "Voucher is expired!",
        applied: false,
      });
    }
    // mengurangi quota voucher
    const reduceQuota = await prisma.voucher.update({
      where: { id: query.id },
      data: {
        quota: query.quota - 1,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Voucher valid!",
      applied: true,
      data: query,
    });
  } catch (error) {
    next(error);
  }
};

const createVoucher = async (req, res, next) => {
  try {
    const query = await prisma.voucher.create({
      data: {
        restaurantId: req.body.restaurantId,
        name: req.body.name,
        code: req.body.code,
        type: req.body.type,
        value: req.body.value,
        minTransaction: req.body.minTransaction,
        maxReduction: req.body.maxReduction,
        quota: req.body.quota,
        expired: new Date(req.body.expired),
      },
    });

    return res.json({
      status: "success",
      message: "Data Created",
    });
  } catch (error) {
    next(error);
  }
};

const editVoucher = async (req, res, next) => {
  const voucher_id = parseInt(req.params.id);

  try {
    if (voucher_id == null) {
      return res.status(409).json({
        status: "error",
        message: "ID cannot be NULL",
      });
    }
    const query = await prisma.voucher.update({
      where: {
        id: voucher_id,
      },
      data: {
        restaurantId: req.body.restaurantId,
        name: req.body.name,
        code: req.body.code,
        type: req.body.type,
        value: req.body.value,
        minTransaction: req.body.minTransaction,
        maxReduction: req.body.maxReduction,
        quota: req.body.quota,
        expired: new Date(req.body.expired),
      },
    });

    return res.json({
      status: "success",
      message: `Updated id: ${voucher_id}`,
    });
  } catch (error) {
    next(error);
  }
};

const deleteVoucher = async (req, res, next) => {
  const voucher_id = parseInt(req.params.id);

  try {
    if (voucher_id == null) {
      return res.status(409).json({
        status: "error",
        message: "ID cannot be NULL",
      });
    }

    const query = await prisma.voucher.delete({
      where: { id: voucher_id },
    });

    return res.json({
      status: "success",
      message: `Deleted id: ${voucher_id}`,
    });
  } catch (error) {
    next(error);
  }
};

export {
  viewVoucher,
  viewVoucherId,
  applyVoucher,
  createVoucher,
  editVoucher,
  deleteVoucher,
};
