import pkg from "@prisma/client";
import { getMenus, updateStokMenu } from "../services/restaurant.js";
import { getUsers } from "../services/user.js";

const prisma = new pkg.PrismaClient();

const viewOrderDetails = async (req, res, next) => {
  try {
    const orderDetails = await prisma.orderDetail.findMany({});
    const getAllUser = await getUsers(orderDetails);
    const getMenusData = await getMenus();

    orderDetails.forEach((orderDetail) => {
      getAllUser.forEach((user) => {
        if (user.id == orderDetail.userId) {
          orderDetail.user = {
            name: user.name,
            phone: user.phone,
            email: user.email,
            imageUrl: user.imageUrl,
          };
        }
      });

      getMenusData.forEach((menu) => {
        if (menu.id == orderDetail.menuId) {
          orderDetail.menus = {
            name: menu.name,
            thumbnail: menu.thumbnail,
            price: menu.price,
          };
        }
      });
    });

    return res.status(200).json({
      status: "success",
      message: "Showed all order details",
      data: orderDetails,
    });
  } catch (error) {
    next(error);
  }
};

const viewOrderDetailById = async (req, res, next) => {
  const id = parseInt(req.params.id);

  try {
    const orderDetail = await prisma.orderDetail.findUnique({
      where: {
        id,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Showed order detail by id",
      data: orderDetail,
    });
  } catch (error) {
    next(error);
  }
};

const createOrderDetails = async (req, res, next) => {
  const { userId, menuId, quantity, notes } = req.body;
  const orderId = parseInt(req.params.id);

  try {
    if (orderId == null || orderId == undefined) {
      return res.status(400).json({
        status: "error",
        message: "Order ID is required",
      });
    }

    const findOrder = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true },
    });

    if (!findOrder) {
      return res.status(404).json({
        status: "error",
        message: "Order not found",
      });
    }
    // check stok menu cukup atau tidak
    const getMenusData = await getMenus();
    const findMenu = getMenusData.find((menu) => menu.id == menuId);

    if (findMenu.stok < parseInt(quantity)) {
      return res.status(400).json({
        status: "error",
        message: "Menu stok is not enough!!",
      });
    }

    const orderDetails = await prisma.orderDetail.create({
      data: {
        orderId: orderId,
        userId: userId,
        menuId: parseInt(menuId),
        quantity: parseInt(quantity),
        notes: notes == null || notes == undefined ? "" : notes,
      },
    });
    // update stok menu
    let newStokMenu = findMenu.stok - orderDetails.quantity;
    await updateStokMenu(orderDetails.menuId, { stok: newStokMenu });

    return res.status(201).json({
      status: "success",
      message: "Order detail created successfully",
      data: orderDetails,
    });
  } catch (error) {
    next(error);
  }
};

const editOrderDetails = async (req, res, next) => {
  const { userId, menuId, quantity, notes } = req.body;
  const orderId = parseInt(req.params.id);
  const orderDetailId = parseInt(req.params.id_detail);

  try {
    if (orderId == null || orderId == undefined) {
      return res.status(400).json({
        status: "error",
        message: "Order ID is required",
      });
    }

    if (orderDetailId == null || orderDetailId == undefined) {
      return res.status(400).json({
        status: "error",
        message: "Order detail ID is required",
      });
    }

    const findOrderDetail = await prisma.orderDetail.findUnique({
      where: { id: orderDetailId },
      select: { id: true, userId: true, menuId: true, notes: true },
    });

    if (!findOrderDetail) {
      return res.status(404).json({
        status: "error",
        message: "Order detail not found",
      });
    }

    const updateOrderDetail = await prisma.orderDetail.update({
      where: { id: orderDetailId },
      data: {
        userId: userId ? userId : findOrderDetail.userId,
        menuId: menuId ? parseInt(menuId) : findOrderDetail.menuId,
        quantity: quantity ? parseInt(quantity) : findOrderDetail.quantity,
        notes: notes ? notes : findOrderDetail.notes,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Order detail updated successfully",
      data: updateOrderDetail,
    });
  } catch (error) {
    next(error);
  }
};

// Controller untuk menghitung jumlah menu yg terjual
const getAmountSold = async (req, res, next) => {
  try {
    const menuIds = req.query.menu_ids || [];

    if (menuIds.length == 0 && !Array.isArray(menuIds)) {
      return res.status(400).json({
        status: "failed",
      });
    }

    const finishedOrder = await prisma.orderDetail.groupBy({
      by: ["menuId"],
      _sum: {
        quantity: true,
      },
      where: {
        order: {
          is: {
            status: "Finished",
          },
        },
        menuId: {
          in: menuIds.map((i) => parseInt(i)).filter((i) => !isNaN(i)),
        },
      },
    });

    res.status(200).json({
      status: "success",
      data: finishedOrder,
    });
  } catch (error) {
    next(error);
  }
};

export {
  createOrderDetails,
  editOrderDetails,
  getAmountSold,
  viewOrderDetails,
  viewOrderDetailById,
};
