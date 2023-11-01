import core from "../config/midtrans.js";

function gopayPayment(amount, orderId) {
  let parameter = {
    payment_type: "gopay",
    transaction_details: {
      gross_amount: parseInt(amount),
      order_id: orderId,
    },
    gopay: {
      enable_callback: true,
      callback_url: "https://maripesan-order-service-r7prwplifa-as.a.run.app/",
    },
    custom_expiry: {
      expiry_duration: 60,
      unit: "minute",
    },
  };

  // charge transaction
  return core.charge(parameter);
}

export default gopayPayment;
