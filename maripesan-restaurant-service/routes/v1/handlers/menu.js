import pkg from "@prisma/client";
import storageUpload from "../helpers/storage-upload.js";
import storageDelete from "../helpers/storage-delete.js";

import { getAmountSoldMenu } from "../services/order.js";

const prisma = new pkg.PrismaClient();

const viewMenu = async (req, res, next) => {
  const role = req.query.role;
  const restaurant_id = parseInt(req.params.id);
  try {
    const findMenuCategory = await prisma.menuCategories.findMany({
      where: { restaurantId: restaurant_id },
      include: {
        menus: {
          where: {
            active: role == "mitra" ? {} : true,
          },
        },
      },
    });

    const rawMenus = await prisma.menus.findMany({
      where: {
        menuCategory: {
          is: {
            restaurantId: restaurant_id,
          },
        },
      },
    });
    const getAmountSold = await getAmountSoldMenu(rawMenus);

    findMenuCategory.forEach((fmc) => {
      fmc.menus.forEach((menu) => {
        getAmountSold.forEach((gas) => {
          if (gas.menuId === menu.id) {
            menu.sold = gas["_sum"].quantity;
          }
        });
      });
    });

    res.status(200).json({
      status: "success",
      message: "Showed menus",
      data: findMenuCategory,
    });
  } catch (error) {
    next(error);
  }
};

const allMenu = async (req, res, next) => {
  try {
    const menu = await prisma.menus.findMany({});
    res.status(200).json({
      status: "success",
      message: "Showed all menus",
      data: menu,
    });
  } catch (error) {
    next(error);
  }
};

const viewMenuId = async (req, res, next) => {
  const restaurant_id = parseInt(req.params.id);
  const menu_id = parseInt(req.params.id_menu);
  try {
    const findMenuCategory = await prisma.menuCategories.findMany({
      where: { restaurantId: restaurant_id },
    });

    // find menu by id menu
    const menu = await Promise.all(
      findMenuCategory.map(async () => {
        const findMenu = await prisma.menus.findUnique({
          where: { id: menu_id },
        });
        return findMenu;
      })
    );

    res.status(200).json({
      status: "success",
      message: "Showed menus",
      data: menu,
    });
  } catch (error) {
    next(error);
  }
};

const createMenu = async (req, res, next) => {
  const { menuCategoryId, name, price, description, stok, buffer } = req.body;

  try {
    if (
      menuCategoryId == null ||
      menuCategoryId == undefined ||
      menuCategoryId == ""
    ) {
      return res.status(400).json({
        status: "error",
        message: "Menu category id is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "Thumbnail is required",
      });
    }
    const publicUrl = await storageUpload(req.file);

    const menu = await prisma.menus.create({
      data: {
        menuCategoryId: parseInt(menuCategoryId),
        name: name,
        price: parseInt(price),
        thumbnail: publicUrl,
        description: description,
        stok: parseInt(stok),
        buffer: buffer != null || buffer != undefined ? parseInt(buffer) : 1,
        active: true,
      },
    });

    res.status(200).json({
      status: "success",
      message: "Created menu",
      data: menu,
    });
  } catch (error) {
    next(error);
  }
};

const editMenu = async (req, res, next) => {
  const id_menu = parseInt(req.params.id);

  try {
    const { menuCategoryId, name, price, description, stok, buffer, active } =
      req.body;

    // Hapus File Lama Dari Storage
    const find = await prisma.menus.findFirst({
      where: { id: id_menu },
    });

    let publicUrl = find.thumbnail;

    if (req.file) {
      if (find.thumbnail.includes("https://storage.googleapis.com/")) {
        const fileName = find.thumbnail.split(
          "https://storage.googleapis.com/" +
            process.env.GCLOUD_STORAGE_BUCKET +
            "/"
        )[1];
        storageDelete(fileName);
      }
      // Input File Baru Ke Storage
      publicUrl = await storageUpload(req.file);
    }

    const menu = await prisma.menus.update({
      where: { id: id_menu },
      data: {
        menuCategoryId:
          menuCategoryId != null || menuCategoryId != undefined
            ? parseInt(menuCategoryId)
            : find.menuCategoryId,
        name: name != null || name != undefined ? name : find.name,
        price:
          price != null || price != undefined ? parseInt(price) : find.price,
        thumbnail: publicUrl,
        description:
          description != null || description != undefined
            ? description
            : find.description,
        stok: stok != null || stok != undefined ? parseInt(stok) : find.stok,
        buffer:
          buffer != null || buffer != undefined
            ? parseInt(buffer)
            : find.buffer,
        active:
          active != null || active != undefined
            ? active == "true"
              ? true
              : false
            : true,
      },
    });

    res.status(200).json({
      status: "success",
      message: "Edited menu",
      data: menu,
    });
  } catch (error) {
    next(error);
  }
};

const deleteMenu = async (req, res, next) => {
  const id_menu = parseInt(req.params.id);

  try {
    const find = await prisma.menus.findUnique({
      where: { id: id_menu },
    });

    if (find == null) {
      return res.status(400).json({
        status: "failed",
        message: "Menu not found",
      });
    }

    if (find.thumbnail.includes("https://storage.googleapis.com/")) {
      const fileName = find.thumbnail.split(
        "https://storage.googleapis.com/" +
          process.env.GCLOUD_STORAGE_BUCKET +
          "/"
      )[1];
      await storageDelete(fileName);
    }

    await prisma.menus.delete({
      where: { id: id_menu },
    });

    res.status(200).json({
      status: "success",
      message: "Deleted menu",
    });
  } catch (error) {
    next(error);
  }
};

const updateAllPriceMenuWithPercentage = async (req, res, next) => {
  const { percentage } = req.body;
  const restaurantId = parseInt(req.params.restaurantId);

  try {
    const findMenuCategory = await prisma.menuCategories.findMany({
      where: { restaurantId: restaurantId },
    });

    // find menu by id menu
    const menu = await Promise.all(
      findMenuCategory.map(async (fmc) => {
        const findMenu = await prisma.menus.findMany({
          where: { menuCategoryId: fmc.id },
        });
        return findMenu;
      })
    );

    const menuUpdate = await Promise.all(
      menu.map((item) => {
        item.map(async (item2) => {
          const menu = await prisma.menus.update({
            where: { id: item2.id },
            data: {
              price: Math.round(
                item2.price + item2.price * (parseInt(percentage) / 100)
              ),
            },
          });
          return menu;
        });
      })
    );

    res.status(200).json({
      status: "success",
      message: "Updated all menu with percentage",
    });
  } catch (error) {
    next(error);
  }
};

export {
  viewMenu,
  allMenu,
  viewMenuId,
  createMenu,
  editMenu,
  deleteMenu,
  updateAllPriceMenuWithPercentage,
};
