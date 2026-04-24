import express from "express";
import {
  createReview,
  getReviews,
  getAllReviews
} from "../controller/reviewController.js";

import isAuth from "../middleware/isAuth.js";

const reviewRouter = express.Router();

// 🔹 CREATE REVIEW
reviewRouter.post("/create", isAuth, createReview);

// 🔹 GET ALL REVIEWS (HOMEPAGE)
reviewRouter.get("/", getAllReviews);   // ⭐ IMPORTANT

// 🔹 GET REVIEWS BY COURSE
reviewRouter.get("/:courseId", getReviews);

export default reviewRouter;