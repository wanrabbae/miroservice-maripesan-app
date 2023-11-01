import pkg from "@prisma/client";

const prisma = new pkg.PrismaClient();

const viewSchedules = async (req, res, next) => {
  try {
    const schedules = await prisma.schedules.findMany({
      include: {
        restaurant: true,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Showed all schedules data",
      data: schedules,
    });
  } catch (error) {
    next(error);
  }
};

const viewScheduleById = async (req, res, next) => {
  const schedule_id = parseInt(req.params.schedule_id);

  try {
    if (schedule_id == null || schedule_id == undefined) {
      return res.status(400).json({
        status: "error",
        message: "required ID cannot be null",
      });
    }

    const findSchedule = await prisma.schedules.findUnique({
      where: { id: schedule_id },
      include: {
        restaurant: true,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Showed schedule",
      data: findSchedule,
    });
  } catch (error) {
    next(error);
  }
};

const createSchedule = async (req, res, next) => {
  const restaurant_id = parseInt(req.params.restaurant_id);
  const { day, open, close, isOpen } = req.body;
  try {
    if (restaurant_id == null || restaurant_id == undefined) {
      return res.status(400).json({
        status: "error",
        message: "required ID cannot be null",
      });
    }

    const save = await prisma.schedules.create({
      data: {
        restaurantId: restaurant_id,
        day,
        open,
        close,
        isOpen,
      },
    });
  } catch (error) {
    next(error);
  }
};

const editSchedule = async (req, res, next) => {
  const { day, open, close, isOpen } = req.body;
  const restaurant_id = parseInt(req.params.restaurant_id);
  const schedule_id = parseInt(req.params.schedule_id);

  try {
    if (
      restaurant_id == null ||
      restaurant_id == undefined ||
      schedule_id == null ||
      schedule_id == undefined
    ) {
      return res.status(400).json({
        status: "error",
        message: "required ID cannot be null",
      });
    }

    const findResto = await prisma.restaurants.findUnique({
      where: { id: restaurant_id },
    });

    if (!findResto) {
      return res.status(404).json({
        status: "error",
        message: "Restaurant not found",
      });
    }

    const findSchedule = await prisma.schedules.findUnique({
      where: { id: schedule_id },
    });

    if (!findSchedule) {
      return res.status(404).json({
        status: "error",
        message: "Schedule not found",
      });
    }

    const updateSchedule = await prisma.schedules.update({
      where: { id: schedule_id },
      data: {
        day: day != null || day != undefined ? day : findSchedule.day,
        open: open != null || open != undefined ? open : findSchedule.open,
        close: close != null || close != undefined ? close : findSchedule.close,
        isOpen:
          isOpen != null || isOpen != undefined ? isOpen : findSchedule.isOpen,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Updated schedule",
      data: updateSchedule,
    });
  } catch (error) {
    next(error);
  }
};

const deleteScheduleById = async (req, res, next) => {
  const schedule_id = parseInt(req.params.schedule_id);

  try {
    if (schedule_id == null || schedule_id == undefined) {
      return res.status(400).json({
        status: "error",
        message: "required ID cannot be null",
      });
    }

    const deleteSchedule = await prisma.schedules.delete({
      where: { id: schedule_id },
    });

    return res.status(200).json({
      status: "success",
      message: "Deleted schedule",
    });
  } catch (error) {
    next(error);
  }
};

export {
  editSchedule,
  viewSchedules,
  createSchedule,
  viewScheduleById,
  deleteScheduleById,
};
