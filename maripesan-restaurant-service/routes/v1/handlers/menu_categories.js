import pkg from "@prisma/client";

const prisma = new pkg.PrismaClient();

const viewMenuCategories = async (req, res, next) => {
  const restaurant_id = parseInt(req.params.id);
  try {
    const findMenuCategory = await prisma.menuCategories.findMany({
      where: { restaurantId: restaurant_id },
    });
    res.status(200).json({
      status: "success",
      message: "Showed menu categories",
      data: findMenuCategory,
    });
  } catch (error) {
    next(error);
  }
};

const viewMenuCategoryById = async (req, res, next) => {
  const menu_category_id = parseInt(req.params.id);

  try {
    const findMenuCategory = await prisma.menuCategories.findUnique({
      where: { id: menu_category_id },
    });

    res.status(200).json({
      status: "success",
      message: "Showed menu category by id",
      data: findMenuCategory,
    });
  } catch (error) {
    next(error);
  }
};

const createMenuCategory = async (req, res, next) => {
  const restaurant_id = parseInt(req.params.id);
  const { category, number } = req.body;

  try {
    const findMenuCategory = await prisma.menuCategories.findFirst({
      where: {
        restaurantId: restaurant_id,
        category: category,
      },
    });

    if (findMenuCategory) {
      return res.status(400).json({
        status: "error",
        message: "Category name was created",
      });
    }

    const createMenuCategory = await prisma.menuCategories.create({
      data: {
        restaurantId: restaurant_id,
        category: category,
        number: number,
      },
    });

    res.status(201).json({
      status: "success",
      message: "Created menu category",
      data: createMenuCategory,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const editMenuCategory = async (req, res, next) => {
  const menu_category_id = parseInt(req.params.id);
  const { category, number } = req.body;

  try {
    const findMenuCategory = await prisma.menuCategories.findUnique({
      where: {
        id: menu_category_id,
      },
    });

    const editMenuCategory = await prisma.menuCategories.update({
      where: {
        id: menu_category_id,
      },
      data: {
        category:
          category != null || category != undefined
            ? category
            : findMenuCategory.category,
        number:
          number != null || number != undefined
            ? number
            : findMenuCategory.number,
      },
    });

    res.status(200).json({
      status: "success",
      message: "Edited menu category",
      data: editMenuCategory,
    });
  } catch (error) {
    next(error);
  }
};

const deleteMenuCategory = async (req, res, next) => {
  const menu_category_id = parseInt(req.params.id);

  try {
    const deleteMenu = await prisma.menuCategories.delete({
      where: {
        id: menu_category_id,
      },
    });

    res.status(200).json({
      status: "success",
      message: "Deleted menu category",
    });
  } catch (error) {
    next(error);
  }
};

export {
  viewMenuCategories,
  viewMenuCategoryById,
  createMenuCategory,
  editMenuCategory,
  deleteMenuCategory,
};
