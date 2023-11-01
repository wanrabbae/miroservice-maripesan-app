import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import error from "http-errors";
import * as routes from "./routes/index.js";
import { callbackOrder } from "./routes/v1/handlers/order.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Order service API",
  });
});
app.post("/", callbackOrder);

app.use("/v1", routes.v1);

app.use((req, res, next) => {
  next(error.NotFound());
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    status: err.status || 500,
    message: err.message,
  });
});

app.listen(port, () => console.log(`Server started on port ${port}`));
