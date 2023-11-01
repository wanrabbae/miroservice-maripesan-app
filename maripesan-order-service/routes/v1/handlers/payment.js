import pkg from "@prisma/client";
import gopayPayment from "../helpers/gopayPayment.js";
import chargeEwallet from "../helpers/xenditEwallet.js";
import { getUsers, getUser } from "../services/user.js";
import { nanoid } from "nanoid";

const prisma = new pkg.PrismaClient();

const viewPayment = async (req, res, next) => {
  try {
    const findPayment = await prisma.payment.findMany({});
    const getAllUser = await getUsers(findPayment);

    findPayment.forEach((payment) => {
      getAllUser.forEach((user) => {
        if (user.id == payment.userId) {
          payment.user = {
            name: user.name,
            phone: user.phone,
            email: user.email,
            imageUrl: user.imageUrl,
          };
        }
      });
    });

    return res.status(200).json({
      status: "success",
      message: "Showed All Payment",
      data: findPayment,
    });
  } catch (error) {
    next(error);
  }
};

const viewPaymentById = async (req, res, next) => {
  const id = parseInt(req.params.id);

  try {
    const findPayment = await prisma.payment.findUnique({
      where: {
        id,
      },
    });

    if (findPayment == null || !findPayment) {
      return res.status(404).json({
        status: "error",
        message: "Payment not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Showed Payment",
      data: findPayment,
    });
  } catch (error) {
    next(error);
  }
};

const createPayment = async (req, res, next) => {
  const order_id = parseInt(req.params.order_id);
  const { userId, invoiceId, total, paymentMethod } = req.body;
  let responsePaymentGateaway;
  let userPhone;

  try {
    if (order_id == null || order_id == undefined) {
      return res.status(400).json({
        status: "error",
        message: "Order ID is required",
      });
    }

    const findOrder = await prisma.order.findUnique({
      where: {
        id: order_id,
      },
      select: {
        id: true,
        userId: true,
        payment: true,
      },
    });

    if (!findOrder) {
      return res.status(400).json({
        status: "error",
        message: "Order ID is not found",
      });
    }

    if (findOrder.payment.length > 0) {
      await prisma.payment.delete({
        where: {
          id: findOrder.payment[0].id,
        },
      });
    }

    const getUserData = await getUser(userId);
    userPhone = getUserData.phone;

    const createPayment = await prisma.payment.create({
      data: {
        orderId: findOrder.id,
        userId: userId,
        invoiceId: "invoice",
        total: parseInt(total),
        expiredTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        status: "Unpaid",
        uid: nanoid(20),
        metadata: { paymentGateAway: "" },
      },
    });

    let id_invoice;
    if (paymentMethod == "GOPAY") {
      // MIDTRANS
      responsePaymentGateaway = await gopayPayment(total, createPayment.uid);
      id_invoice = responsePaymentGateaway.transaction_id;
    } else {
      // XENDIT
      responsePaymentGateaway = await chargeEwallet(
        total,
        createPayment.uid,
        paymentMethod,
        userPhone
      );
      id_invoice = responsePaymentGateaway.id;
    }

    const updatePayment = await prisma.payment.update({
      where: {
        id: createPayment.id,
      },
      data: {
        invoiceId: id_invoice,
        metadata: {
          paymentGateAway: { responsePaymentGateaway },
        },
      },
    });

    return res.status(201).json({
      status: "success",
      message: "Payment created",
      data: updatePayment,
    });
  } catch (error) {
    next(error);
  }
};

export { createPayment, viewPayment, viewPaymentById };
