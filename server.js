import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import cors from "cors";
import categoryRoute from "./routes/categoryRoute.js";
import productRoute from "./routes/productRoutes.js";
import path from "path";
dotenv.config();
connectDB();
const app = express();
const __dirname = path.dirname("");
const buildpath = path.join(__dirname, "../client/build");
app.use(express.static(buildpath));

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product", productRoute);

app.get("/", (req, res) => {
  res.send({
    message: "Welcome to ecommerce app",
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(
    `Your server is running on ${process.env.DEV_MODE} mode of port ${PORT}`
      .bgWhite.black
  );
});
