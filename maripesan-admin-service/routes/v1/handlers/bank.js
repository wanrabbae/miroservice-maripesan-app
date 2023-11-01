import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();
import storageUpload from "../helpers/storage-upload.js";
import storageDelete from "../helpers/storage-delete.js";

// Bank
const viewBank = async (req, res, next) => {
  try {
    const query = await prisma.bank.findMany();

    return res.json({
      status: "success",
      message: "Data Showed",
      data: query,
    });
  } catch (error) {
    next(error);
  }
};

const viewBankId = async (req, res, next) => {
  const bank_id = parseInt(req.params.id);

  try {
    if (bank_id == null) {
      return res.status(409).json({
        status: "error",
        message: "ID cannot be NULL",
      });
    }

    const query = await prisma.bank.findMany({
      where: { id: bank_id },
    });

    return res.json({
      status: "success",
      message: `Showed id: ${bank_id}`,
      data: query,
    });
  } catch (error) {
    next(error);
  }
};

const createBank = async (req, res, next) => {
  try {
    const publicUrl = await storageUpload(req.file);
    const query = await prisma.bank.create({
      data: {
        name: req.body.name,
        imageUrl: publicUrl,
        status: "deactivated",
      },
    });

    return res.json({
      status: "success",
      message: "Uploaded the file successfully: ",
      data: publicUrl,
    });
  } catch (error) {
    next(error);
  }
};

const editBank = async (req, res, next) => {
  const bank_id = parseInt(req.params.id);
  try {
    if (bank_id == null) {
      return res.status(409).json({
        status: "error",
        message: "ID cannot be NULL",
      });
    }

    // Hapus File Lama Dari Storage
    const find = await prisma.bank.findFirst({
      where: { id: bank_id },
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
    const query = await prisma.bank.update({
      where: {
        id: bank_id,
      },
      data: {
        name: req.body.name,
        imageUrl: publicUrl,
        status: req.body.status,
      },
    });

    return res.json({
      status: "success",
      message: `Updated id: ${bank_id}`,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBank = async (req, res, next) => {
  const bank_id = parseInt(req.params.id);

  try {
    if (bank_id == null) {
      return res.status(409).json({
        status: "error",
        message: "ID cannot be NULL",
      });
    }

    const find = await prisma.bank.findFirst({
      where: { id: bank_id },
    });
    const fileName = find.imageUrl.split(
      "https://storage.googleapis.com/" +
        process.env.GCLOUD_STORAGE_BUCKET +
        "/"
    )[1];
    storageDelete(fileName);

    const query = await prisma.bank.delete({
      where: { id: bank_id },
    });

    return res.json({
      status: "success",
      message: `Deleted id: ${bank_id}`,
    });
  } catch (error) {
    next(error);
  }
};

export { viewBank, viewBankId, createBank, editBank, deleteBank };
