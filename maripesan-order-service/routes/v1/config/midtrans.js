import "dotenv/config";
import midtransClient from "midtrans-client";
// Create Core API instance
let core = new midtransClient.CoreApi({
  isProduction: false, // change into true if in production
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export default core;
