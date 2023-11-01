import pkg from "@prisma/client";
import storageUpload from "../helpers/storage-upload.js";
import storageDelete from "../helpers/storage-delete.js";

const prisma = new pkg.PrismaClient();

const viewPhotos = async (req, res, next) => {
  const restaurant_id = parseInt(req.params.id);

  try {
    if (req.params.id == null || req.params.id == undefined) {
      return res.status(400).json({
        status: "error",
        message: "ID cannot be null",
      });
    }

    const photos = await prisma.restaurantPhotos.findMany({
      where: {
        restaurantId: restaurant_id,
      },
      orderBy: {
        number: "asc",
      },
    });

    res.status(200).json({
      status: "success",
      message: "Showed restaurant thumbnails",
      data: photos,
    });
  } catch (error) {
    next(error);
  }
};

const viewPhotoById = async (req, res, next) => {
  const restaurant_id = parseInt(req.params.id);
  const thumbnail_id = parseInt(req.params.id_thumb);

  try {
    const findPhoto = await prisma.restaurantPhotos.findUnique({
      where: { id: thumbnail_id },
    });

    res.status(200).json({
      status: "success",
      message: "Showed thumbnail by id",
      data: findPhoto,
    });
  } catch (error) {
    next(error);
  }
};

const createPhotos = async (req, res, next) => {
  const restaurant_id = parseInt(req.params.id);

  try {
    if (req.params.id == null || req.params.id == undefined) {
      return res.status(400).json({
        status: "error",
        message: "ID cannot be null",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "Thumbnail required",
      });
    }

    const publicUrl = await storageUpload(req.file);

    const createPhoto = await prisma.restaurantPhotos.create({
      data: {
        restaurantId: restaurant_id,
        photoUrl: publicUrl,
        number: parseInt(req.body.number),
      },
    });

    const findThumbnails = await prisma.restaurantPhotos.findMany({
      where: { restaurantId: restaurant_id },
      select: { restaurantId: true, number: true, photoUrl: true },
    });

    findThumbnails.map(async (data) => {
      if (data.number === 1) {
        await prisma.restaurants.update({
          where: { id: restaurant_id },
          data: {
            thumbnail: data.photoUrl,
          },
        });
      } else {
        await prisma.restaurants.update({
          where: { id: restaurant_id },
          data: {
            thumbnail: data.photoUrl,
          },
        });
      }
    });

    res.status(201).json({
      status: "success",
      message: "Created restaurant photo",
      data: createPhoto,
    });
  } catch (error) {
    next(error);
  }
};

const deletePhoto = async (req, res, next) => {
  const restaurant_id = parseInt(req.params.id);
  const thumbnail_id = parseInt(req.params.id_thumb);

  try {
    if (req.params.id_thumb == null || req.params.id_thumb == undefined) {
      return res.status(400).json({
        status: "error",
        message: "ID cannot be null",
      });
    }

    const photo = await prisma.restaurantPhotos.findUnique({
      where: {
        id: thumbnail_id,
      },
      select: {
        id: true,
        photoUrl: true,
      },
    });

    if (photo == null) {
      return res.status(404).json({
        status: "error",
        message: "Photo not found",
      });
    }

    const fileName = photo.photoUrl.split(
      "https://storage.googleapis.com/" +
        process.env.GCLOUD_STORAGE_BUCKET +
        "/"
    )[1];

    await storageDelete(fileName);

    const deletePhoto = await prisma.restaurantPhotos.delete({
      where: {
        id: thumbnail_id,
      },
    });

    res.status(200).json({
      status: "success",
      message: "Deleted restaurant photo",
    });
  } catch (error) {
    next(error);
  }
};

const updatePhoto = async (req, res, next) => {
  const restaurant_id = parseInt(req.params.id);
  const thumbnail_id = parseInt(req.params.id_thumb);

  try {
    if (req.params.id_thumb == null || req.params.id_thumb == undefined) {
      return res.status(400).json({
        status: "error",
        message: "ID cannot be null",
      });
    }

    // Hapus File Lama Dari Storage
    const find = await prisma.restaurantPhotos.findFirst({
      where: { id: thumbnail_id },
    });

    let publicUrl = find.photoUrl;

    if (req.file) {
      if (find.photoUrl.includes("https://storage.googleapis.com/")) {
        const fileName = find.photoUrl.split(
          `https://storage.googleapis.com/${process.env.GCLOUD_STORAGE_BUCKET}/`
        )[1];
        storageDelete(fileName);
      }
      // Input File Baru Ke Storage
      publicUrl = await storageUpload(req.file);
    }

    const updatePhoto = await prisma.restaurantPhotos.update({
      where: {
        id: thumbnail_id,
      },
      data: {
        photoUrl: publicUrl,
        number: parseInt(req.body.number),
      },
    });

    const findThumbnails = await prisma.restaurantPhotos.findMany({
      where: { restaurantId: restaurant_id },
      select: { restaurantId: true, number: true, photoUrl: true },
    });

    findThumbnails.map(async (data) => {
      if (data.number === 1) {
        await prisma.restaurants.update({
          where: { id: restaurant_id },
          data: {
            thumbnail: data.photoUrl,
          },
        });
      } else {
        await prisma.restaurants.update({
          where: { id: restaurant_id },
          data: {
            thumbnail: data.photoUrl,
          },
        });
      }
    });

    res.status(200).json({
      status: "success",
      message: "Updated restaurant photo",
      data: updatePhoto,
    });
  } catch (error) {
    next(error);
  }
};

export { viewPhotos, viewPhotoById, createPhotos, deletePhoto, updatePhoto };
