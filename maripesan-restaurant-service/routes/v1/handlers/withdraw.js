import pkg from "@prisma/client";
import storageUpload from "../helpers/storage-upload.js";

const prisma = new pkg.PrismaClient();

const viewWithdraw = async (req, res, next) => {
  const userId = req.user.user_id;
  const role = req.role;
  try {
    let withdraw;

    if (role == "admin") {
      withdraw = await prisma.withdraws.findMany({
        include: {
          restaurant: true,
        },
      });
    } else {
      const findRestaurantWithUserId = await prisma.restaurants.findFirst({
        where: {
          userId: userId,
        },
        select: {
          id: true,
        },
      });

      if (findRestaurantWithUserId == null || !findRestaurantWithUserId) {
        return res.status(404).json({
          status: "failed",
          message: `Restaurant with user id  ${userId} not found!`,
        });
      }

      const findWithdrawWithRestaurantId = await prisma.withdraws.findMany({
        where: {
          restaurantId: findRestaurantWithUserId.id,
        },
      });

      withdraw = findWithdrawWithRestaurantId;
    }

    res.status(200).json({
      status: "success",
      data: withdraw,
    });
  } catch (error) {
    next(error);
  }
};

const viewWithdrawId = async (req, res, next) => {
  try {
    const withdraw = await prisma.withdraws.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
      include: {
        restaurant: true,
      },
    });

    res.status(200).json({
      status: "success",
      data: withdraw,
    });
  } catch (error) {
    next(error);
  }
};

const createWithdraw = async (req, res, next) => {
  const id_restaurant = parseInt(req.params.id);

  try {
    const { amount, bank, account_name, account_number } = req.body;

    if (id_restaurant == null || id_restaurant == undefined) {
      return res.status(400).json({
        success: "error",
        message: "ID is required",
      });
    }

    const withdraw = await prisma.withdraws.create({
      data: {
        restaurantId: id_restaurant,
        amount,
        status: "Pending",
        bank,
        accountName: account_name,
        accountNumber: account_number,
      },
    });

    res.status(201).json({
      status: "success",
      message: "Withdraw created",
      data: withdraw,
    });
  } catch (error) {
    next(error);
  }
};

const editWithdraw = async (req, res, next) => {
  const id_withdraw = parseInt(req.params.id);
  try {
    const { amount, status } = req.body;

    if (id_withdraw == null || id_withdraw == undefined) {
      return res.status(400).json({
        success: "error",
        message: "ID is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: "error",
        message: "Bukti transfer harus diupload!",
      });
    }

    const publicUrl = await storageUpload(req.file);

    const withdraw = await prisma.withdraws.update({
      where: {
        id: id_withdraw,
      },
      data: {
        amount: parseInt(amount),
        status,
        imageUrl: publicUrl,
      },
    });

    res.status(200).json({
      status: "success",
      message: "Withdraw updated",
      data: withdraw,
    });
  } catch (error) {
    next(error);
  }
};

const deleteWithdraw = async (req, res, next) => {
  const id_withdraw = parseInt(req.params.id);
  try {
    if (id_withdraw == null || id_withdraw == undefined) {
      return res.status(400).json({
        success: "error",
        message: "ID is required",
      });
    }

    const withdraw = await prisma.withdraws.delete({
      where: {
        id: id_withdraw,
      },
    });

    res.status(200).json({
      status: "success",
      message: "Withdraw deleted",
    });
  } catch (error) {
    next(error);
  }
};

export {
  viewWithdraw,
  viewWithdrawId,
  createWithdraw,
  editWithdraw,
  deleteWithdraw,
};
