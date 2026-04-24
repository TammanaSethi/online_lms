import express from "express";
const courseRouter = express.Router();

import {
  createCourse,
  editCourse,
  getCourseById,
  getCreaterCourses,
  getPublishedCourses,
  removeCourse,
  getCreatorById,
  createLecture,
  getCourseLecture,
  editLecture,
  removeLecture,
  getCoursesByCreator,
  getPopularCourses
} from "../controller/courseController.js";

import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";
import { searchWithAi } from "../controller/searchController.js";

// ================= CREATE COURSE =================
courseRouter.post(
  "/create",
  isAuth,
  upload.single("thumbnail"),
  createCourse
);

// ================= GET PUBLISHED COURSES =================
// ✅ FIX: added isAuth so req.userId works
courseRouter.get("/published", getPublishedCourses);

// ================= GET CREATOR COURSES =================
courseRouter.get("/getcreator", isAuth, getCreaterCourses);

// ================= EDIT COURSE =================
courseRouter.post(
  "/editcourse/:courseId",
  isAuth,
  upload.single("thumbnail"),
  editCourse
);
// ================= GET COURSE BY ID =================
courseRouter.get("/getcourse/:courseId", isAuth, getCourseById);

// ================= DELETE COURSE =================
courseRouter.delete("/getcourse/:courseId", isAuth, removeCourse);

// ================= GET CREATOR BY ID =================
courseRouter.post("/creater", isAuth, getCreatorById);

// ================= CREATE LECTURE =================
courseRouter.post("/createlecture/:courseId", isAuth, createLecture);

// ================= GET COURSE LECTURES =================
courseRouter.get("/courselecture/:courseId", isAuth, getCourseLecture);

// ================= EDIT LECTURE =================
courseRouter.put(
  "/editlecture/:lectureId",
  isAuth,
  (req, res, next) => {
    upload.single("videoUrl")(req, res, function (err) {
      if (err) {
        console.log("❌ FULL MULTER ERROR:", err);
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }
      next();
    });
  },
  editLecture
);

// ================= DELETE LECTURE =================
courseRouter.delete("/removelecture/:lectureId", isAuth, removeLecture);

// ================= GET COURSES BY CREATOR =================
courseRouter.get("/creator-courses/:creatorId", getCoursesByCreator);

// ================= SEARCH =================
courseRouter.post("/search", searchWithAi);

// ================= POPULAR COURSES =================
courseRouter.get("/popular", getPopularCourses);

export default courseRouter;