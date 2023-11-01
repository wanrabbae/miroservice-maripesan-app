import pkg from "@prisma/client";
import storageUpload from "../helpers/storage-upload.js";
import storageDelete from "../helpers/storage-delete.js";
import { getUserById, getUsers } from "../services/user.js";

const prisma = new pkg.PrismaClient();

const viewRestaurants = async (req, res, next) => {
  const { limit, name, category } = req.query;
  let results = [];
  try {
    const restaurantIds = req.query.restaurant_ids || [];

    if (category) {
      const findRestaurantWithCategory =
        await prisma.restaurantCategories.findMany({
          where: {
            category: category,
          },
          include: {
            restaurants: true,
          },
        });

      if (!findRestaurantWithCategory) {
        return res.status(404).json({
          status: "error",
          message: "Category not found",
        });
      }

      return res.status(200).json({
        status: "success",
        message: "Showed restaurant with category",
        data: findRestaurantWithCategory,
      });
    } else if (name) {
      // search menu
      const findMenu = await prisma.menus.findMany({
        where: {
          active: true,
          name: {
            contains: name,
          },
        },
        include: {
          menuCategory: {
            select: {
              restaurant: {
                include: {
                  restaurantCategory: {
                    select: {
                      id: true,
                      category: true,
                      imageUrl: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!findMenu) {
        return res.status(404).json({
          status: "error",
          message: "Menu not found",
        });
      }

      return res.status(200).json({
        status: "success",
        message: "Showed restaurant with menu",
        data: findMenu,
      });
    }

    const prismaOptions = {
      select: {
        id: true,
        userId: true,
        name: true,
        thumbnail: true,
        address: true,
        description: true,
        restaurantCategory: true,
      },
      take: limit ? parseInt(limit) : undefined,
      orderBy: { id: "desc" },
    };

    if (restaurantIds.length > 0 && Array.isArray(restaurantIds)) {
      prismaOptions.where = {
        id: {
          in: restaurantIds.map((i) => parseInt(i)).filter((i) => !isNaN(i)),
        },
      };
    }

    // NOTE: JANGAN TAMPILKAN RESTAURANT JIKA SI USER SUDAH DISBALED (isDisabled == true)
    const restaurants = await prisma.restaurants.findMany(prismaOptions);
    // const getAllUsers = await getUsers(restaurants);

    // restaurants.map((resto) => {
    //   getAllUsers.map((user) => {
    //     if (user.isDisabled == false || user.isDisabled == 0) {
    //       results.push(resto);
    //     }
    //   });
    // });

    return res.json({
      status: "success",
      message: "Showed all restaurant",
      data: restaurants,
    });
  } catch (error) {
    next(error);
  }
};

const viewRestaurantId = async (req, res, next) => {
  try {
    if (req.params.id == null) {
      return res.status(400).json({
        status: "error",
        message: "ID cannot be null",
      });
    }

    const restaurant = await prisma.restaurants.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        restaurantCategory: true,
        restaurantPhotos: true,
        menuCategories: true,
        schedules: true,
      },
    });

    return res.json({
      status: "success",
      message: "Showed restaurant",
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
};

const checkRestaurantSchedule = async (req, res, next) => {
  const restaurantId = req.params.id;

  try {
    const restaurant = await prisma.restaurants.findUnique({
      where: { id: parseInt(restaurantId) },
      include: {
        schedules: true,
      },
    });

    const { schedules } = restaurant;

    const now = new Date();
    let hari = now.getDay();
    const schedule = schedules.find((schedule) => {
      const { day } = schedule;

      switch (hari) {
        case 0:
          hari = "Minggu";
          break;
        case 1:
          hari = "Senin";
          break;
        case 2:
          hari = "Selasa";
          break;
        case 3:
          hari = "Rabu";
          break;
        case 4:
          hari = "Kamis";
          break;
        case 5:
          hari = "Jumat";
          break;
        case 6:
          hari = "Sabtu";
          break;
      }

      return day == hari;
    });

    if (!schedule) {
      return res.status(200).json({
        status: "CLOSED",
      });
    }

    const { close } = schedule;

    const close2 = parseInt(close.split(":")[0]);

    const startTime = new Date().getHours();
    if (startTime > close2) {
      return res.status(200).json({
        status: "CLOSED",
      });
    } else if (startTime == close2) {
      return res.status(200).json({
        status: "CLOSED",
      });
    } else {
      return res.status(200).json({
        status: "OPEN",
      });
    }
  } catch (error) {
    next(error);
  }
};

const createRestaurant = async (req, res, next) => {
  try {
    const { restaurantCategoryId, userId, name, address, description } =
      req.body;

    let publicUrl = req.body.thumbnail || "";

    if (req.file) {
      publicUrl = await storageUpload(req.file);
    }

    const restaurant = await prisma.restaurants.create({
      data: {
        restaurantCategoryId:
          restaurantCategoryId != null || restaurantCategoryId != undefined
            ? parseInt(restaurantCategoryId)
            : null,
        userId: userId,
        name,
        address,
        thumbnail: publicUrl,
        description: description,
        balance: 0,
        active: false,
      },
    });

    if (restaurant) {
      await prisma.schedules.createMany({
        data: [
          {
            restaurantId: restaurant.id,
            day: "Senin",
            open: "00:00",
            close: "00:00",
            isOpen: false,
          },
          {
            restaurantId: restaurant.id,
            day: "Selasa",
            open: "00:00",
            close: "00:00",
            isOpen: false,
          },
          {
            restaurantId: restaurant.id,
            day: "Rabu",
            open: "00:00",
            close: "00:00",
            isOpen: false,
          },
          {
            restaurantId: restaurant.id,
            day: "Kamis",
            open: "00:00",
            close: "00:00",
            isOpen: false,
          },
          {
            restaurantId: restaurant.id,
            day: "Jumat",
            open: "00:00",
            close: "00:00",
            isOpen: false,
          },
          {
            restaurantId: restaurant.id,
            day: "Sabtu",
            open: "00:00",
            close: "00:00",
            isOpen: false,
          },
          {
            restaurantId: restaurant.id,
            day: "Minggu",
            open: "00:00",
            close: "00:00",
            isOpen: false,
          },
        ],
      });
    }

    return res.status(201).json({
      status: "success",
      message: "Created restaurant",
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
};

const editRestaurant = async (req, res, next) => {
  const restaurantId = parseInt(req.params.id);
  try {
    const {
      restaurantCategoryId,
      name,
      address,
      description,
      balance,
      active,
    } = req.body;

    // Hapus File Lama Dari Storage
    const find = await prisma.restaurants.findUnique({
      where: { id: restaurantId },
    });

    let publicUrl = find.thumbnail;

    if (req.file) {
      if (find.thumbnail.includes("https://storage.googleapis.com/")) {
        const fileName = find.thumbnail.split(
          `https://storage.googleapis.com/${process.env.GCLOUD_STORAGE_BUCKET}/`
        )[1];
        await storageDelete(fileName);
      }
      // Input File Baru Ke Storage
      publicUrl = await storageUpload(req.file);
    }

    const restaurant = await prisma.restaurants.update({
      where: { id: restaurantId },
      data: {
        restaurantCategoryId:
          restaurantCategoryId != null || restaurantCategoryId !== undefined
            ? parseInt(restaurantCategoryId)
            : find.restaurantCategoryId,
        name: name != null || name !== undefined ? name : find.name,
        address:
          address != null || address !== undefined ? address : find.address,
        thumbnail: publicUrl,
        description: description,
        balance:
          balance != null || balance !== undefined
            ? parseInt(balance)
            : find.balance,
        active: active != null || active !== undefined ? active : find.active,
      },
    });

    return res.json({
      status: "success",
      message: "Updated restaurant",
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
};

const deleteRestaurant = async (req, res, next) => {
  const restaurant_id = parseInt(req.params.id);

  try {
    const restaurant = await prisma.restaurants.delete({
      where: { id: restaurant_id },
    });

    return res.json({
      status: "success",
      message: "Deleted restaurant",
    });
  } catch (error) {
    next(error);
  }
};

export {
  viewRestaurantId,
  viewRestaurants,
  checkRestaurantSchedule,
  createRestaurant,
  editRestaurant,
  deleteRestaurant,
};
