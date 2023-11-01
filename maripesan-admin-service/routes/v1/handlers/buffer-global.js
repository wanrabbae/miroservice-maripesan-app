import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

// Buffer Global
const viewBufferGlobal = async (req, res, next) => {
  try {
    const query = await prisma.bufferGlobal.findMany();

    return res.json({
      status: "success",
      message: "Data Showed",
      data: query,
    });
  } catch (error) {
    next(error);
  }
};

const editBufferGlobal = async (req, res, next) => {
  try {
    const query = await prisma.bufferGlobal.updateMany({
      data: {
        bufferGlobal: req.body.bufferGlobal,
      },
    });

    return res.json({
      status: "success",
      message: `Update Success`,
    });
  } catch (error) {
    next(error);
  }
};

export { viewBufferGlobal, editBufferGlobal };
