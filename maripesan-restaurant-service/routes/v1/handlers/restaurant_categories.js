import pkg from "@prisma/client";
import storageUpload from "../helpers/storage-upload.js";
import storageDelete from "../helpers/storage-delete.js";

const prisma = new pkg.PrismaClient();

const viewRestaurantCategories = async (req, res, next) => {
  try {
    const restaurantCategories = await prisma.restaurantCategories.findMany({
      orderBy: { id: "desc" },
    });
    res.json({
      status: "success",
      message: "Showed all restaurant categories",
      data: restaurantCategories,
    });
  } catch (error) {
    next(error);
  }
};

const viewRestaurantCategoryById = async (req, res, next) => {
  const id = parseInt(req.params.id);

  try {
    const restaurantCategories = await prisma.restaurantCategories.findUnique({
      where: { id: id },
    });
    res.json({
      status: "success",
      message: "Showed restaurant category",
      data: restaurantCategories,
    });
  } catch (error) {
    next(error);
  }
};

const createRestaurantCategory = async (req, res, next) => {
  try {
    const { category } = req.body;
    const publicUrl = await storageUpload(req.file);
    const restaurantCategory = await prisma.restaurantCategories.create({
      data: {
        category,
        imageUrl: publicUrl,
      },
    });
    res.json({
      status: "success",
      message: "Created restaurant category",
      data: restaurantCategory,
    });
  } catch (error) {
    next(error);
  }
};

const deleteRestaurantCategory = async (req, res, next) => {
  const id = parseInt(req.params.id);
  try {
    // Hapus File Lama Dari Storage
    const find = await prisma.restaurantCategories.findFirst({
      where: { id: id },
    });
    const fileName = find.imageUrl.split(
      "https://storage.googleapis.com/" +
        process.env.GCLOUD_STORAGE_BUCKET +
        "/"
    )[1];
    storageDelete(fileName);

    const restaurantCategory = await prisma.restaurantCategories.delete({
      where: {
        id,
      },
    });
    res.json({
      status: "success",
      message: "Deleted restaurant category",
      data: restaurantCategory,
    });
  } catch (error) {
    next(error);
  }
};

const updateRestaurantCategory = async (req, res, next) => {
  const id = parseInt(req.params.id);
  const { category } = req.body;
  try {
    // Hapus File Lama Dari Storage
    const find = await prisma.restaurantCategories.findFirst({
      where: { id: id },
    });

    if (!find) {
      return res.status(404).json({
        status: "failed",
        code: 404,
        message: "Category not found",
      });
    }

    let publicUrl = find.imageUrl;

    if (req.file) {
      if (find.imageUrl.includes("https://storage.googleapis.com/")) {
        const fileName = find.imageUrl.split(
          `https://storage.googleapis.com/${process.env.GCLOUD_STORAGE_BUCKET}/`
        )[1];
        storageDelete(fileName);
      }
      // Input File Baru Ke Storage
      publicUrl = await storageUpload(req.file);
    }

    const updated = await prisma.restaurantCategories.update({
      where: { id: id },
      data: {
        category:
          category != null || category != undefined ? category : find.category,
        imageUrl: publicUrl,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Updated restaurant category",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export {
  viewRestaurantCategories,
  viewRestaurantCategoryById,
  createRestaurantCategory,
  deleteRestaurantCategory,
  updateRestaurantCategory,
};
