import express from "express";
import {
  login,
  logOut,
  signUp
} from "../controller/authController.js";

const authRouter = express.Router();

// ✅ AUTH ROUTES
authRouter.post("/signup", signUp);
authRouter.post("/login", login);
authRouter.get("/logout", logOut);

export default authRouter;