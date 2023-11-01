import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

// Withdraw Cut
const viewWithdrawCut = async (req, res, next) => {
  try {
    const query = await prisma.withdrawCut.findMany();

    return res.json({
      status: "success",
      message: "Data Showed",
      data: query,
    });
  } catch (error) {
    next(error);
  }
};

const editWithdrawCut = async (req, res, next) => {
  try {
    const query = await prisma.withdrawCut.updateMany({
      data: {
        percentageCut: req.body.withdrawCut,
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

export { viewWithdrawCut, editWithdrawCut };
