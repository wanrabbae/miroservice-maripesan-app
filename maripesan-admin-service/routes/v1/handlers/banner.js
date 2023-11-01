import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();
import storageUpload from "../helpers/storage-upload.js";
import storageDelete from "../helpers/storage-delete.js";

// Banner
const viewBanner = async (req, res, next) => {
  try {
    const query = await prisma.banner.findMany();

    return res.json({
      status: "success",
      message: "Data Showed",
      data: query,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

const viewBannerId = async (req, res, next) => {
  const banner_id = parseInt(req.params.id);

  try {
    if (banner_id == null) {
      return res.status(409).json({
        status: "error",
        message: "ID cannot be NULL",
      });
    }
    const query = await prisma.banner.findMany({
      where: { id: banner_id },
    });

    return res.json({
      status: "success",
      message: `Showed id: ${banner_id}`,
      data: query,
    });
  } catch (error) {
    next(error);
  }
};

const createBanner = async (req, res, next) => {
  try {
    const number = `${req.body.number}`;
    const publicUrl = await storageUpload(req.file);
    const query = await prisma.banner.create({
      data: {
        imageUrl: publicUrl,
        number: parseInt(number),
      },
    });
    res.status(200).send({
      status: "success",
      message: "Uploaded the file successfully: ",
      data: publicUrl,
    });
  } catch (error) {
    next(error);
  }
};

const editBanner = async (req, res, next) => {
  const banner_id = parseInt(req.params.id);
  const number = req.body.number;
  try {
    if (banner_id == null) {
      return res.status(409).json({
        status: "error",
        message: "ID cannot be NULL",
      });
    }

    // Hapus File Lama Dari Storage
    const find = await prisma.banner.findUnique({
      where: { id: banner_id },
    });

    let publicUrl = find.imageUrl;

    if (req.file) {
      if (find.imageUrl.includes("https://storage.googleapis.com/")) {
        const fileName = find.imageUrl.split(
          "https://storage.googleapis.com/" +
            process.env.GCLOUD_STORAGE_BUCKET +
            "/"
        )[1];
        storageDelete(fileName);
      }
      // Input File Baru Ke Storage
      publicUrl = await storageUpload(req.file);
    }

    // Update Database
    const query = await prisma.banner.update({
      where: {
        id: banner_id,
      },
      data: {
        imageUrl: publicUrl,
        number: parseInt(number),
      },
    });

    return res.json({
      status: "success",
      message: `Updated id: ${banner_id}`,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBanner = async (req, res, next) => {
  const banner_id = parseInt(req.params.id);

  try {
    if (banner_id == null) {
      return res.status(409).json({
        status: "error",
        message: "ID cannot be NULL",
      });
    }
    const find = await prisma.banner.findUnique({
      where: { id: banner_id },
    });
    const fileName = find.imageUrl.split(
      "https://storage.googleapis.com/" +
        process.env.GCLOUD_STORAGE_BUCKET +
        "/"
    )[1];
    storageDelete(fileName);

    const query = await prisma.banner.delete({
      where: { id: banner_id },
    });

    return res.json({
      status: "success",
      message: `Deleted id: ${banner_id}`,
    });
  } catch (error) {
    next(error);
  }
};

export { viewBanner, viewBannerId, createBanner, editBanner, deleteBanner };
