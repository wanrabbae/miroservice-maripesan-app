import Xendit from "xendit-node";
const xenditPayment = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY,
});

export default xenditPayment;
