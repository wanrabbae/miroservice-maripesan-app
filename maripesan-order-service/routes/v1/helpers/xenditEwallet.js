import xenditPayment from "../config/xendit.js";

const ewalletSpecificOptions = {};
const ewallet = new xenditPayment.EWallet(ewalletSpecificOptions);

async function chargeEwallet(amount, orderId, paymentMethod, mobileNumber) {
  let parameter;
  let paymentMethodUpperCase = paymentMethod.toUpperCase();
  try {
    if (paymentMethodUpperCase == "OVO" && mobileNumber) {
      parameter = {
        referenceID: `${orderId}`,
        currency: "IDR",
        amount: parseInt(amount),
        checkoutMethod: "ONE_TIME_PAYMENT",
        channelCode: `ID_${paymentMethodUpperCase}`,
        channelProperties: {
          mobileNumber: mobileNumber, // ONLY OVO
          successRedirectURL:
            "https://maripesan-order-service-r7prwplifa-as.a.run.app/",
          failureRedirectURL:
            "https://maripesan-order-service-r7prwplifa-as.a.run.app/",
        },
        metadata: {
          branch_code: "tree_branch",
        },
      };
    } else {
      parameter = {
        referenceID: `${orderId}`,
        currency: "IDR",
        amount: parseInt(amount),
        checkoutMethod: "ONE_TIME_PAYMENT",
        channelCode: `ID_${paymentMethodUpperCase}`,
        channelProperties: {
          successRedirectURL:
            "https://maripesan-order-service-r7prwplifa-as.a.run.app/",
          failureRedirectURL:
            "https://maripesan-order-service-r7prwplifa-as.a.run.app/",
        },
        metadata: {
          branch_code: "tree_branch",
        },
      };
    }

    const resp = await ewallet.createEWalletCharge(parameter);

    return resp;
  } catch (error) {
    console.log(error);
  }
}

export default chargeEwallet;
