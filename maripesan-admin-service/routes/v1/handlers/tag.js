import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

// Tag
const viewTag = async (req, res, next) => {
  try {
    const query = await prisma.tag.findMany();

    return res.json({
      status: "success",
      message: "Data Showed",
      data: query,
    });
  } catch (error) {
    next(error);
  }
};

const viewTagId = async (req, res, next) => {
  const tag_id = parseInt(req.params.id);

  try {
    if (tag_id == null) {
      return res.status(409).json({
        status: "error",
        message: "ID cannot be NULL",
      });
    }

    const query = await prisma.tag.findMany({
      where: { id: tag_id },
    });

    return res.json({
      status: "success",
      message: `Showed id: ${tag_id}`,
      data: query,
    });
  } catch (error) {
    next(error);
  }
};

const createTag = async (req, res, next) => {
  try {
    const publicUrl = await storageUpload(req.file);
    const query = await prisma.tag.create({
      data: {
        tag: req.body.tag,
        imageUrl: publicUrl,
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

const editTag = async (req, res, next) => {
  const tag_id = parseInt(req.params.id);

  try {
    if (tag_id == null) {
      return res.status(409).json({
        status: "error",
        message: "ID cannot be NULL",
      });
    }
    // Hapus File Lama Dari Storage
    const find = await prisma.tag.findFirst({
      where: { id: tag_id },
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
    const query = await prisma.tag.update({
      where: {
        id: tag_id,
      },
      data: {
        tag: req.body.tag,
        imageUrl: publicUrl,
      },
    });

    return res.json({
      status: "success",
      message: `Updated id: ${tag_id}`,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTag = async (req, res, next) => {
  const tag_id = parseInt(req.params.id);

  try {
    if (tag_id == null) {
      return res.status(409).json({
        status: "error",
        message: "ID cannot be NULL",
      });
    }
    const find = await prisma.tag.findFirst({
      where: { id: tag_id },
    });
    const fileName = find.imageUrl.split(
      "https://storage.googleapis.com/" +
        process.env.GCLOUD_STORAGE_BUCKET +
        "/"
    )[1];
    storageDelete(fileName);

    const query = await prisma.tag.delete({
      where: { id: tag_id },
    });

    return res.json({
      status: "success",
      message: `Deleted id: ${tag_id}`,
    });
  } catch (error) {
    next(error);
  }
};

export { viewTag, viewTagId, createTag, editTag, deleteTag };
