import { getUserRole } from "../routes/v1/services/user.js";

const checkAllRole = async (req, res, next) => {
  const idUser = req.user.user_id;

  const getRoleUser = await getUserRole(idUser);

  if (
    getRoleUser.role == "user" ||
    getRoleUser.role == "mitra" ||
    getRoleUser.role == "admin"
  ) {
    req.role = getRoleUser.role;
    next();
  } else {
    res.status(401).json({
      status: "error",
      message: "You are not authorized to access this resource",
    });
  }
};

const checkMitraRole = async (req, res, next) => {
  const idUser = req.user.user_id;

  const getRoleUser = await getUserRole(idUser);

  if (getRoleUser.role == "mitra" || getRoleUser.role == "admin") {
    req.role = getRoleUser.role;
    next();
  } else {
    res.status(401).json({
      status: "error",
      message: "You are not authorized to access this resource",
    });
  }
};

const checkAdminRole = async (req, res, next) => {
  const idUser = req.user.user_id;

  const getRoleUser = await getUserRole(idUser);

  if (getRoleUser.role == "admin") {
    next();
  } else {
    res.status(401).json({
      status: "error",
      message: "You are not authorized to access this resource",
    });
  }
};

export { checkMitraRole, checkAdminRole, checkAllRole };
