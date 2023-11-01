import pkg from "@prisma/client";
import { getMenus, getRestaurant } from "../services/restaurant.js";
import { getUsers } from "../services/user.js";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// get all carts data
const viewAllCarts = async (req, res, next) => {
  const userId = req.query.user;
  try {
    let parameter = {
      where: userId
        ? {
            userId: userId,
          }
        : {},
      include: {
        cartDetails: true,
        cartShares: true,
      },
    };

    const query = await prisma.cart.findMany(parameter);

    const getAllRestaurant = await getRestaurant(query);
    const getMenusData = await getMenus();
    const getAllUser = await getUsers(query);

    query.forEach((cartDetail) => {
      getAllUser.forEach((user) => {
        if (user.id == cartDetail.userId) {
          cartDetail.user = {
            name: user.name,
            phone: user.phone,
            email: user.email,
            imageUrl: user.imageUrl,
          };
        }
      });

      getAllRestaurant.forEach((resto) => {
        if (resto.id == cartDetail.restaurantId) {
          cartDetail.restaurant = {
            id: resto.id,
            name: resto.name,
            phone: resto.phone,
          };
        }
      });

      cartDetail.cartDetails.forEach((cartDetail) => {
        const { name, thumbnail, price, stok } = getMenusData.find(
          (menu) => menu.id === cartDetail.menuId
        );
        cartDetail.menus = {
          name,
          thumbnail,
          price,
          stok
        };
      });
    });

    return res.json({
      status: "success",
      message: `Showed all carts`,
      data: query,
    });
  } catch (e) {
    next(e);
  }
};

const getCurrentUserCarts = async (req, res, next) => {
  try {
    const query = await prisma.cart.findMany({
      where: { userId: req.user.user_id },
      include: {
        cartDetails: true,
        cartShares: true,
      },
    });

    const getMenusData = await getMenus();

    query.forEach((cartDetail) => {
      cartDetail.cartDetails.forEach((cartDetail) => {
        const { name, thumbnail, price, stok } = getMenusData.find(
          (menu) => menu.id === cartDetail.menuId
        );
        cartDetail.menus = {
          name,
          thumbnail,
          price,
          stok
        };
      });
    });

    return res.json({
      status: "success",
      message: `Showed current user cart`,
      data: query,
    });
  } catch (e) {
    next(e);
  }
};

const viewCart = async (req, res, next) => {
  const cart_id = parseInt(req.params.id);
  try {
    if (cart_id == null) {
      return res.status(409).json({
        status: "error",
        message: "ID cannot be NULL",
      });
    }
    const query = await prisma.cart.findUnique({
      where: { id: cart_id },
      include: {
        cartDetails: true,
        cartShares: true,
      },
    });

    const getMenusData = await getMenus();

    query.cartDetails.forEach((cartDetail) => {
      const { name, thumbnail, price, stok } = getMenusData.find(
        (menu) => menu.id === cartDetail.menuId
      );
      cartDetail.menus = {
        name,
        thumbnail,
        price,
        stok
      };
    });

    return res.json({
      status: "success",
      message: `ID of showed data is:" ${cart_id}`,
      data: query,
    });
  } catch (error) {
    if (error.message.includes("null (reading 'cartDetails')"))
      error.status = 404;
    next(error);
  }
};

const createCart = async (req, res, next) => {
  try {
    const query = await prisma.cart.create({
      data: {
        userId: req.body.userId,
        restaurantId: req.body.restaurantId,
        process: req.body.process,
        type: req.body.type,
        dineTime: req.body.dineTime,
        notes: req.body.notes,
      },
    });
    return res.json({
      status: "Success",
      message: "Data created",
      data: query,
    });
  } catch (error) {
    error.status = 400;
    console.log(error);
    next(error);
  }
};

const updateCart = async (req, res, next) => {
  const cart_id = parseInt(req.params.id);
  try {
    const query = await prisma.cart.update({
      where: { id: cart_id },
      data: {
        userId: req.body.userId,
        restaurantId: req.body.restaurantId,
        process: req.body.process,
        type: req.body.type,
        dineTime: req.body.dineTime,
        notes: req.body.notes,
      },
    });
    return res.json({
      status: "Success",
      message: "Data updated",
      data: query,
    });
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

const deleteCart = async (req, res, next) => {
  const cart_id = parseInt(req.params.id);
  try {
    if (cart_id == null) {
      return res.status(409).json({
        status: "error",
        message: "ID cannot be NULL",
      });
    }
    const query = await prisma.cart.delete({
      where: { id: cart_id },
    });
    return res.json({
      status: "success",
      message: `Deleted id: ${cart_id}`,
    });
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

// get all cart details data
const viewAllCartDetails = async (req, res, next) => {
  const details_id = parseInt(req.query.id);
  try {
    if (details_id) {
      const query = await prisma.cartDetail.findUnique({
        where: { id: details_id },
        include: {
          cart: true,
        },
      });
      return res.json({
        status: "success",
        message: `Showed all cart details`,
        data: query,
      });
    }

    const query = await prisma.cartDetail.findMany({
      include: {
        cart: true,
      },
    });

    const getMenusData = await getMenus();
    const getAllUser = await getUsers(query);

    query.forEach((cartDetail) => {
      getAllUser.forEach((user) => {
        if (user.id == cartDetail.userId) {
          cartDetail.user = {
            name: user.name,
            phone: user.phone,
            email: user.email,
            imageUrl: user.imageUrl,
          };
        }
      });

      const { name, thumbnail, price } = getMenusData.find(
        (menu) => menu.id === cartDetail.menuId
      );
      cartDetail.menus = {
        name,
        thumbnail,
        price,
      };
    });

    return res.json({
      status: "success",
      message: `Showed all cart details`,
      data: query,
    });
  } catch (e) {
    next(e);
  }
};

const editCartDetails = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const query = await prisma.cartDetail.update({
      where: {
        id: id,
      },
      data: {
        userId: req.body.userId,
        menuId: req.body.menuId,
        quantity: req.body.quantity,
        notes: req.body.notes,
      },
    });
    return res.json({
      status: "success",
      message: `cart detail successfully updated`,
      data: query,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCartDetails = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const query = await prisma.cartDetail.delete({
      where: { id: id },
    });
    return res.json({
      status: "success",
      message: `Deleted id: ${id}`,
    });
  } catch (error) {
    next(error);
  }
};

const createCartDetails = async (req, res, next) => {
  const id_cart = parseInt(req.params.id_cart);
  try {
    const exist = await prisma.cartDetail.findFirst({
      where: {
        cartId: id_cart,
        userId: req.body.userId,
        menuId: req.body.menuId,
      },
    });
    if (exist) {
      return res.status(409).json({
        status: "error",
        message: "ID cannot be NULL",
      });
    }
    const query = await prisma.cartDetail.create({
      data: {
        cartId: id_cart,
        userId: req.body.userId,
        menuId: req.body.menuId,
        quantity: req.body.quantity,
        notes: req.body.notes,
      },
    });
    return res.json({
      status: "success",
      message: `Data Created`,
      data: query,
    });
  } catch (error) {
    next(error);
  }
};

// get all cart shares
const viewAllCartShares = async (req, res, next) => {
  const shares_id = parseInt(req.query.id);
  try {
    if (shares_id) {
      const query = await prisma.cartShares.findUnique({
        where: { id: shares_id },
        include: {
          cart: true,
        },
      });
      const now = new Date();
      const activeLimit = new Date(query.activeLimit);

      if (now > activeLimit) {
        query.active = false;
      } else {
        query.active = true;
      }

      return res.json({
        status: "success",
        message: `Showed all cart shares`,
        data: query,
      });
    }

    const query = await prisma.cartShares.findMany({
      include: {
        cart: true,
      },
    });

    query.forEach((qr) => {
      const now = new Date();
      const activeLimit = new Date(qr.activeLimit);
      if (now > activeLimit) {
        qr.active = false;
      } else {
        qr.active = true;
      }
    });

    return res.json({
      status: "success",
      message: `Showed all cart shares`,
      data: query,
    });
  } catch (e) {
    next(e);
  }
};

const createCartShares = async (req, res, next) => {
  const id_cart = parseInt(req.params.id);

  try {
    const query = await prisma.cartShares.create({
      data: {
        cartId: id_cart,
        activeLimit: new Date(req.body.activeLimit),
        paymentType: req.body.paymentType,
      },
    });

    return res.json({
      status: "success",
      message: `Data Created`,
      data: query,
    });
  } catch (error) {
    next(error);
  }
};

const editCartShares = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const query = await prisma.cartShares.update({
      where: {
        id: id,
      },
      data: {
        cartId: parseInt(req.body.cartId),
        activeLimit: new Date(req.body.activeLimit),
        paymentType: req.body.paymentType,
      },
    });
    return res.json({
      status: "success",
      message: `cart share successfully updated`,
      data: query,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCartShares = async (req, res, next) => {
  const id = parseInt(req.params.id);

  try {
    const query = await prisma.cartShares.delete({
      where: { id: id },
    });
    return res.json({
      status: "success",
      message: `Deleted id: ${id}`,
    });
  } catch (error) {
    next(error);
  }
};

const checkCartSharesActiveLimt = async (req, res, next) => {
  const idCart = parseInt(req.params.id);

  try {
    const query = await prisma.cartShares.findFirst({
      where: {
        cartId: idCart,
      },
    });
    console.log(query);
    // check if activeLimit is expired with datetime now
    const now = new Date();
    const activeLimit = new Date(query.activeLimit);
    if (now > activeLimit) {
      return res.json({
        status: "error",
        message: "activeLimit is expired",
        cartExpired: true,
      });
    }

    return res.json({
      status: "success",
      message: "activeLimit is not expired",
      cartExpired: false,
    });
  } catch (error) {
    next(error);
  }
};

export {
  getCurrentUserCarts,
  viewAllCarts,
  viewAllCartDetails,
  viewAllCartShares,
  viewCart,
  createCart,
  updateCart,
  deleteCart,
  editCartDetails,
  deleteCartDetails,
  createCartDetails,
  createCartShares,
  deleteCartShares,
  editCartShares,
  checkCartSharesActiveLimt,
};
