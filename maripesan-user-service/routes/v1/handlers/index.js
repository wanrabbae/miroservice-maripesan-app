import pkg from "@prisma/client";
import storageUpload from "../helpers/storage-upload.js";
import storageDelete from "../helpers/storage-delete.js";
const { PrismaClient } = pkg;
import { getRestaurant } from "../services/restaurant.js";

const prisma = new PrismaClient();

const index = async (req, res, next) => {
  try {
    const userIds = req.query.user_ids || [];

    const prismaOptions = {
      select: {
        id: true,
        roleId: true,
        name: true,
        email: true,
        phone: true,
        fcm: true,
        imageUrl: true,
        provider: true,
        isDisabled: true,
        googleId: true,
        createdAt: true,
        updatedAt: true,
        role: true,
      },
    };

    if (userIds.length > 0 && Array.isArray(userIds)) {
      prismaOptions.where = {
        id: {
          in: userIds,
        },
      };
    }

    const users = await prisma.user.findMany(prismaOptions);

    return res.json({
      status: "success",
      message: "Users fetched successfully",
      data: users,
    });
  } catch (e) {
    next(e);
  }
};

const checkUserPhone = async (req, res, next) => {
  try {
    const phones = req.query.phones || [];

    if (phones.length > 0 && Array.isArray(phones)) {
      const users = await prisma.user.findMany({
        where: {
          phone: {
            in: phones,
          },
        },
      });

      const data = phones.map((phone) => {
        return users.some((user) => user.phone === phone);
      });

      return res.json(data);
    }

    return res.status(400).json({
      status: "error",
      message: "please provide valid query format",
    });
  } catch (e) {
    next(e);
  }
};

const store = async (req, res, next) => {
  try {
    const isUserExist = await prisma.user.findUnique({
      where: { email: req.body.email },
    });

    if (isUserExist) {
      return res.status(400).json({
        status: "error",
        message: "User already exists",
      });
    }

    const role = await prisma.role.findFirst({
      where: { role: "user" },
    });

    if (!role) {
      return res.status(404).json({
        status: "error",
        message: "Role not found, please contact administrator",
      });
    }

    let publicUrl = req.body.imageUrl;

    if (req.file) {
      publicUrl = await storageUpload(req.file);
    }

    const user = await prisma.user.create({
      data: {
        id: req.body.id,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone ?? "",
        imageUrl: publicUrl,
        roleId:
          req.body.roleId !== undefined || req.body.roleId !== null
            ? req.body.roleId
            : role.id,
        provider: req.body.provider,
        googleId: req.body.googleId,
        fcm: req.body.fcm,
      },
    });

    return res.json({
      status: "success",
      message: "User created successfully",
      data: user,
    });
  } catch (e) {
    next(e);
  }
};

const show = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        roleId: true,
        name: true,
        email: true,
        phone: true,
        isDisabled: true,
        fcm: true,
        imageUrl: true,
        provider: true,
        googleId: true,
        createdAt: true,
        updatedAt: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    return res.json({
      status: "success",
      message: `User fetched successfully id: ${id}`,
      data: user,
    });
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    if (req.body.email) {
      const checkEmail = await prisma.user.findUnique({
        where: { email: req.body.email },
      });

      if (checkEmail && req.body.email !== user.email) {
        return res.status(409).json({
          status: "error",
          message: "email already exist",
        });
      }
    }

    const data = {
      roleId: parseInt(req.body.roleId) || req.body.roleId,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      imageUrl: req.body.imageUrl,
      fcm: req.body.fcm,
      googleId: req.body.googleId,
      provider: req.body.provider,
    };

    if (req.file) {
      if (
        user.imageUrl &&
        user.imageUrl.includes("https://storage.googleapis.com/")
      ) {
        const fileName = user.imageUrl.split(
          "https://storage.googleapis.com/" +
            process.env.GCLOUD_STORAGE_BUCKET +
            "/"
        )[1];
        storageDelete(fileName);
      }
      // Input File Baru Ke Storage
      data.imageUrl = await storageUpload(req.file);
    }

    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data,
    });

    return res.json({
      status: "success",
      message: `User data updated`,
      data: updatedUser,
    });
  } catch (e) {
    next(e);
  }
};

const deleteUser = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isDisabled: true },
    });

    return res.status(200).json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getUserFavourite = async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const rawFavourites = await prisma.favourite.findMany({
      where: {
        userId: id,
      },
      select: {
        id: true,
        restaurantId: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    const favourites = await getRestaurant(rawFavourites);
    rawFavourites.forEach((rw) => {
      favourites.forEach((favourite) => {
        if (rw.restaurantId === favourite.id) {
          favourite.favouriteId = rw.id;
        }
      });
    });

    return res.json({
      status: "success",
      message: `User favourites fetched successfully`,
      data: favourites,
    });
  } catch (e) {
    next(e);
  }
};

const createUserFavourite = async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const isFavouriteExist = await prisma.favourite.findFirst({
      where: {
        userId: id,
        restaurantId: req.body.restaurantId,
      },
    });

    if (isFavouriteExist) {
      return res.status(409).json({
        status: "error",
        message: "Favourite already exists",
      });
    }

    const favourite = await prisma.favourite.create({
      data: {
        userId: id,
        restaurantId: req.body.restaurantId,
      },
    });

    return res.json({
      status: "success",
      message: `Added favourite successfully`,
      data: favourite,
    });
  } catch (e) {
    next(e);
  }
};

const deleteUserFavourite = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const favourite = await prisma.favourite.findUnique({
      where: {
        id,
      },
    });

    if (!favourite) {
      return res.status(404).json({
        status: "error",
        message: "Favourite not found",
      });
    }

    await prisma.favourite.delete({
      where: {
        id,
      },
    });

    return res.json({
      status: "success",
      message: `Favourite deleted id: ${id}`,
    });
  } catch (e) {
    next(e);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        roleId: true,
        name: true,
        email: true,
        phone: true,
        isDisabled: true,
        fcm: true,
        imageUrl: true,
        provider: true,
        googleId: true,
        createdAt: true,
        updatedAt: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    return res.json({
      status: "success",
      message: `user fetched successfully`,
      data: user,
    });
  } catch (e) {
    next(e);
  }
};

const getCurrentUserFavourite = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const rawFavourites = await prisma.favourite.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        restaurantId: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    const favourites = await getRestaurant(rawFavourites);
    rawFavourites.forEach((rw) => {
      favourites.forEach((favourite) => {
        if (rw.restaurantId === favourite.id) {
          favourite.favouriteId = rw.id;
        }
      });
    });

    return res.json({
      status: "success",
      message: `user favourites fetched successfully`,
      data: favourites,
    });
  } catch (e) {
    next(e);
  }
};

const getUserRole = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        role: {
          select: {
            id: true,
            role: true,
          },
        },
      },
    });

    return res.json({
      status: "success",
      message: `user role fetched successfully`,
      data: user,
    });
  } catch (e) {
    next(e);
  }
};

const createUserRole = async (req, res, next) => {
  try {
    const role = await prisma.role.create({
      data: {
        role: req.body.role.toLowerCase(),
      },
    });

    return res.json({
      status: "success",
      message: "Role created successfully",
      data: role,
    });
  } catch (e) {
    next(e);
  }
};

const getAllRole = async (req, res, next) => {
  try {
    const roles = await prisma.role.findMany({
      select: {
        id: true,
        role: true,
      },
    });

    return res.json({
      status: "success",
      message: "Role fetched successfully",
      data: roles,
    });
  } catch (e) {
    next(e);
  }
};

export {
  index,
  show,
  update,
  deleteUser,
  getUserFavourite,
  createUserFavourite,
  deleteUserFavourite,
  store,
  getCurrentUser,
  getCurrentUserFavourite,
  getUserRole,
  createUserRole,
  getAllRole,
  checkUserPhone,
};
