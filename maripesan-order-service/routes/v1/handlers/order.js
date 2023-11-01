import pkg from "@prisma/client";
import {
  getRestaurants,
  getMenus,
  updateStokMenu,
  getMenuCategories,
  getRestaurant,
} from "../services/restaurant.js";
import { getUser, getUsers } from "../services/user.js";
import axios from "axios";
import { GoogleAuth } from "google-auth-library";
const auth = new GoogleAuth();

const prisma = new pkg.PrismaClient();

const viewCurrentUserOrders = async (req, res, next) => {
  const { status } = req.query;
  const userId = req.user.user_id;

  try {
    let params = {
      where: {
        userId: userId,
      },
      orderBy: { id: "desc" },
      include: {
        orderDetails: true,
        payment: true,
      },
    };

    if (status == "running") {
      params.where.OR = [
        { status: "Unpaid" },
        { status: "Paid" },
        { status: "Waiting" },
        { status: "Aceppted" },
      ];
    } else if (status == "history") {
      params.where.OR = [{ status: "Finished" }, { status: "Cancelled" }];
    }

    const orders = await prisma.order.findMany(params);

    const getResto = await getRestaurants();
    const getMenusData = await getMenus();

    orders.forEach((order) => {
      getResto.forEach((resto) => {
        if (order.restaurantId == resto.id) {
          order.restaurantData = {
            name: resto.name,
            address: resto.address,
            thumbnail: resto.thumbnail,
          };
        }
      });

      order.orderDetails.forEach(async (orderDetail) => {
        if (orderDetail.menuId != null) {
          const { name, thumbnail, price } = getMenusData.find(
            (menu) => menu.id == orderDetail.menuId
          );
          orderDetail.menus = {
            name: name,
            thumbnail: thumbnail,
            price: price,
          };
        }
      });
    });

    return res.status(200).json({
      status: "success",
      message: "Showed orders",
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

const viewOrders = async (req, res, next) => {
  const { order_status } = req.query;
  const restaurant_id = parseInt(req.params.restaurants_id);
  try {
    if (restaurant_id == undefined || restaurant_id == null) {
      return res.status(400).json({
        status: "error",
        message: "A url parameter restaurants_id is required",
      });
    }

    let params = {
      where: {
        restaurantId: restaurant_id,
        status: order_status,
      },
      orderBy: { id: "desc" },
      include: {
        orderDetails: true,
        payment: true,
      },
    };

    const orders = await prisma.order.findMany(params);

    const getResto = await getRestaurants(orders);
    const getAllUser = await getUsers(orders);
    const getMenusData = await getMenus();

    orders.forEach((order) => {
      getResto.forEach((resto) => {
        if (order.restaurantId == resto.id) {
          order.restaurantData = {
            name: resto.name,
            address: resto.address,
            thumbnail: resto.thumbnail,
          };
        }
      });

      getAllUser.forEach((user) => {
        if (user.id == order.userId) {
          order.user = {
            name: user.name,
            phone: user.phone,
            email: user.email,
            imageUrl: user.imageUrl,
          };
        }
      });

      order.orderDetails.forEach(async (orderDetail) => {
        if (orderDetail.menuId != null) {
          const { name, thumbnail, price } = getMenusData.find(
            (menu) => menu.id == orderDetail.menuId
          );
          orderDetail.menus = {
            name: name,
            thumbnail: thumbnail,
            price: price,
          };
        }
      });
    });

    return res.status(200).json({
      status: "success",
      message: "Showed orders",
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

const createOrder = async (req, res, next) => {
  const {
    userId,
    restaurantId,
    voucherCode,
    voucherValue,
    total,
    type,
    notes,
    metadata,
  } = req.body;

  try {
    const createOrder = await prisma.order.create({
      data: {
        userId: userId,
        restaurantId: parseInt(restaurantId),
        voucherCode:
          voucherCode == null || voucherCode == undefined ? "" : voucherCode,
        voucherValue:
          voucherValue == null || voucherValue == undefined ? 0 : voucherValue,
        total: parseInt(total),
        type: type,
        notes: notes == null || notes == undefined ? "" : notes,
        status: "Unpaid",
        metadata: metadata == null || metadata == undefined ? "" : metadata,
      },
    });

    return res.status(201).json({
      status: "success",
      message: "Order created",
      data: createOrder,
    });
  } catch (error) {
    next(error);
  }
};

const callbackOrder = async (req, res, next) => {
  const { order_id, status_code } = req.body;

  if (status_code && status_code == "200") {
    try {
      const findPayment = await prisma.payment.findFirst({
        where: { uid: order_id },
        select: { id: true, userId: true, order: true, uid: true },
      });

      if (!findPayment) {
        return res.status(404).json({
          status: "error",
          message: "Order not found",
        });
      }

      const updateStatusOrder = await prisma.order.update({
        where: { id: findPayment.order.id },
        data: {
          status: "Waiting",
        },
      });

      const updateStatusPayment = await prisma.payment.update({
        where: { id: findPayment.id },
        data: {
          status: "Waiting",
        },
      });

      let fcm = "";

      // ambil single data restaurant lalu ambil userId nya.
      const restaurant = await getRestaurant(findPayment.order.restaurantId);
      const userId = restaurant.userId;

      // ambil single data user lalu ambil fcm nya, lalu assign ke variable fcm.
      const user = await getUser(userId);
      fcm = user.fcm;

      // ==== SEND NOTIFICATION ====
      const sendNotif = await axios.post(
        "https://fcm.googleapis.com/fcm/send",
        {
          to: user.fcm,
          notification: {
            title: "New Order is Coming !!",
            body: `Pesanan oleh ${user.name}`,
            android_channel_id: "mari_pesan_mitra_1112",
          },
          priority: "high",
        },
        {
          headers: {
            Authorization: `key=${process.env.FCM_SERVER_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      return res.status(200).json({
        status: "success",
        message: "Order paid",
        data: updateStatusPayment,
      });
    } catch (error) {
      next(error);
    }
  } else if (req.body.data && req.body.data.status == "SUCCEEDED") {
    const orderId = req.body.data.reference_id;
    try {
      const findPayment = await prisma.payment.findFirst({
        where: { uid: orderId },
        select: { id: true, userId: true, order: true, uid: true },
      });

      if (!findPayment) {
        return res.status(404).json({
          status: "error",
          message: "Order not found",
        });
      }

      const updateStatusOrder = await prisma.order.update({
        where: { id: findPayment.order.id },
        data: {
          status: "Waiting",
        },
      });

      const updateStatusPayment = await prisma.payment.update({
        where: { id: findPayment.id },
        data: {
          status: "Waiting",
        },
      });

      let fcm = "";

      // ambil single data restaurant lalu ambil userId nya.
      const restaurant = await getRestaurant(findPayment.order.restaurantId);
      const userId = restaurant.userId;

      // ambil single data user lalu ambil fcm nya, lalu assign ke variable fcm.
      const user = await getUser(userId);
      fcm = user.fcm;

      // ==== SEND NOTIFICATION ====
      const sendNotif = await axios.post(
        "https://fcm.googleapis.com/fcm/send",
        {
          to: user.fcm,
          notification: {
            title: "New Order is Coming !!",
            body: `Pesanan oleh ${user.name}`,
            android_channel_id: "mari_pesan_mitra_1112",
          },
          priority: "high",
        },
        {
          headers: {
            Authorization: `key=${process.env.FCM_SERVER_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      return res.status(200).json({
        status: "success",
        message: "Order paid",
        data: updateStatusPayment,
      });
    } catch (error) {
      next(error);
    }
  } else {
    return res.json({
      status: "warning",
      message: "Order canceled or expired",
    });
  }
};

const editOrder = async (req, res, next) => {
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

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: req.body,
    });

    return res.status(200).json({
      status: "success",
      message: "Order updated",
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

const deleteOrder = async (req, res, next) => {
  const orderId = parseInt(req.params.id);

  try {
    if (orderId == null || orderId == undefined) {
      return res.status(400).json({
        status: "failed",
        message: "Order ID is required",
      });
    }

    if (req.role == "admin") {
      await prisma.order.delete({
        where: { id: orderId },
      });

      return res.status(200).json({
        status: "success",
        message: "Order deleted",
      });
    }

    const findOrder = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        userId: true,
        orderDetails: true,
      },
    });
    // update menu
    const findMenu = await getMenus();
    findOrder.orderDetails.map((orderDetail) => {
      findMenu.map(async (menu) => {
        if (orderDetail.menuId == menu.id) {
          let newStok = menu.stok + orderDetail.quantity;
          await updateStokMenu(orderDetail.menuId, { stok: newStok });
        }
      });
    });

    const updateOrderToCancelled = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "Cancelled",
      },
    });

    const updatePaymentToCancelled = await prisma.payment.updateMany({
      where: { orderId: orderId },
      data: {
        status: "Cancelled",
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Order cancelled",
    });
  } catch (error) {
    next(error);
  }
};

const getSummaryOrder = async (req, res, next) => {
  const restaurantId = parseInt(req.params.restaurant_id);
  const { tanggal } = req.query;
  const date = new Date(tanggal);
  const newDate = new Date(date.setDate(date.getDate() + 2));

  try {
    if (!date || tanggal == null || tanggal == undefined || !tanggal) {
      return res.status(400).json({
        status: "error",
        message: "Tanggal not valid",
      });
    }

    const orders = await prisma.order.findMany({
      where: {
        AND: [
          {
            restaurantId: restaurantId,
          },
          {
            createdAt: {
              gt: new Date(tanggal),
              lt: newDate,
            },
          },
        ],
      },
      include: {
        orderDetails: true,
      },
    });

    let sumTotalOrder = 0;
    let totalQuantity = 0;
    let totalJenisItem = 0;

    const menus = await getMenus();

    const menuCategories = await getMenuCategories(restaurantId);
    orders.map((order) => {
      sumTotalOrder += order.total;
      order.orderDetails.map(async (orderDetail) => {
        // hitung jumlah item terjual
        totalQuantity += orderDetail.quantity;
        // proses hitung jenis item terjual
        menus.map(async (menu) => {
          if (orderDetail.menuId == menu.id) {
            await menuCategories.map((menuCategory) => {
              if (menu.menuCategoryId == menuCategory.id) {
                totalJenisItem += 1;
              }
            });
          }
        });
      });
    });

    return res.status(200).json({
      status: "success",
      data: {
        total_transaksi: orders.length,
        total_pemasukan: sumTotalOrder,
        total_item_terjual: totalQuantity,
        total_jenis_item: totalJenisItem,
      },
    });
  } catch (error) {
    next(error);
  }
};

export {
  viewOrders,
  viewCurrentUserOrders,
  createOrder,
  callbackOrder,
  editOrder,
  deleteOrder,
  getSummaryOrder,
};
