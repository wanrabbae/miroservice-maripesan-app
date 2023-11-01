import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

const viewRestaurantTag = async (req, res, next) => {
  try {
    const query = await prisma.restaurantTag.findMany();

    return res.json({
      status: "success",
      message: "Data Showed",
      data: query,
    });
  } catch (error) {
    next(error);
  }
};

const createRestaurantTag = async (req, res, next) => {
  try {
    const query = await prisma.restaurantTag.create({
      data: {
        restaurantId: req.body.restaurantId,
        tagId: req.body.tagId,
      },
    });

    return res.json({
      status: "success",
      message: "Data Created",
    });
  } catch (error) {
    next(error);
  }
};

const deleteRestaurantTag = async (req, res, next) => {
  const restaurant_tag_id = parseInt(req.params.id);

  try {
    if (restaurant_tag_id == null) {
      return res.status(409).json({
        status: "error",
        message: "ID cannot be NULL",
      });
    }
    const query = await prisma.restaurantTag.delete({
      where: { id: restaurant_tag_id },
    });

    return res.json({
      status: "success",
      message: `Deleted id: ${restaurant_tag_id}`,
    });
  } catch (error) {
    next(error);
  }
};

export { viewRestaurantTag, createRestaurantTag, deleteRestaurantTag };
