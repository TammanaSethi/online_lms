import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import connectDb from "./config/connectDB.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

// routes
import authRouter from "./route/authRoute.js";
import userRouter from "./route/userRoute.js";
import courseRouter from "./route/courseRoute.js";
import paymentRoute from "./route/paymentRoute.js";
import reviewRouter from "./route/reviewRoute.js";

const app = express();
const port = process.env.PORT || 8000;

// ✅ middlewares
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ✅ serve uploaded files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ✅ routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/course", courseRouter);
app.use("/api/order", paymentRoute);
app.use("/api/review", reviewRouter);

// test route
app.get("/", (req, res) => {
  res.send("Server running successfully");
});

// ✅ start server
app.listen(port, () => {
  console.log("🚀 Server Started on port", port);
  connectDb();
});