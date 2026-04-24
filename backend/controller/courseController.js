import Course from "../model/courseModel.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import Lecture from "../model/LectureModel.js";
import User from "../model/userModel.js";


// ================= CREATE COURSE =================
export const createCourse = async (req, res) => {
  try {
    const { title, category } = req.body;

    if (!title || !category) {
      return res.status(400).json({
        message: "title or category is required",
      });
    }

    let thumbnail;

    if (req.file) {
      const uploadedImage = await uploadOnCloudinary(req.file.path);
      if (uploadedImage) {
        thumbnail = uploadedImage;
      }
    }

    const course = await Course.create({
      title,
      category,
      thumbnail,
      creater: req.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ================= GET ALL PUBLISHED COURSES =================
export const getPublishedCourses = async (req, res) => {
  try {
    const userId = req.userId || null;

    const courses = await Course.find({ isPublished: true })
      .populate("lectures")
      .populate({
        path: "reviews",
        select: "rating",
      });

    const updatedCourses = courses.map((course) => {
      const isEnrolled =
        userId &&
        course.enrolledStudents?.some(
          (id) => id.toString() === userId
        );

      return {
        ...course._doc,
        isEnrolled: isEnrolled || false,
      };
    });

    return res.status(200).json({
      success: true,
      data: updatedCourses,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET CREATOR COURSES =================
export const getCreaterCourses = async (req, res) => {
  try {
    const userId = req.userId;

    const courses = await Course.find({ creater: userId }).populate({
      path: "reviews",
      select: "rating",
    });

    const updatedCourses = courses.map((course) => ({
      ...course._doc,
      isEnrolled: false,
    }));

    return res.status(200).json({
      success: true,
      data: updatedCourses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET COURSES BY CREATOR =================
export const getCoursesByCreator = async (req, res) => {
  try {
    const { creatorId } = req.params;

    const courses = await Course.find({
      creater: creatorId,
      isPublished: true,
    }).populate({
      path: "reviews",
      select: "rating",
    });

    return res.status(200).json({
      success: true,
      data: courses,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ================= GET COURSE BY ID =================
export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId)
      .populate("lectures")
      .populate({
        path: "reviews",
        select: "rating user comment",
      });

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: course,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ================= EDIT COURSE =================
export const editCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    let course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const {
      title,
      subTitle,
      description,
      category,
      level,
      isPublished,
      price,
    } = req.body;

    // ✅ update only if exists
    if (title !== undefined) course.title = title;
    if (subTitle !== undefined) course.subTitle = subTitle;
    if (description !== undefined) course.description = description;
    if (category !== undefined) course.category = category;
    if (level !== undefined) course.level = level;
    if (isPublished !== undefined) course.isPublished = isPublished;
    if (price !== undefined) course.price = price;

    // ✅ THUMBNAIL FIX
    if (req.file) {
      console.log("FILE RECEIVED:", req.file);

      const uploadedImage = await uploadOnCloudinary(req.file.path);

      console.log("UPLOADED IMAGE:", uploadedImage);

      if (uploadedImage) {
        course.thumbnail = uploadedImage;
      }
    }

    // 🔥 VERY IMPORTANT
    await course.save();

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// ================= DELETE COURSE =================
export const removeCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};



// ================= CREATE LECTURE =================
export const createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const lecture = await Lecture.create({
      lectureTitle,
      videoUrl: "",
      course: courseId,
    });

    course.lectures.push(lecture._id);
    await course.save();

    return res.status(201).json({
      success: true,
      lecture,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};



// ================= GET COURSE LECTURES =================
export const getCourseLecture = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId).populate("lectures");

    return res.status(200).json({
      success: true,
      lectures: course.lectures,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};



// ================= EDIT LECTURE =================
export const editLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;

    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found",
      });
    }

    if (req.body.lectureTitle) {
      lecture.lectureTitle = req.body.lectureTitle;
    }

    if (req.body.isPreviewFree !== undefined) {
      lecture.isPreviewFree = req.body.isPreviewFree === "true";
    }

    if (req.file) {
      lecture.videoUrl = `uploads/${req.file.filename}`;
    }

    await lecture.save();

    return res.status(200).json({
      success: true,
      lecture,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};



// ================= DELETE LECTURE =================
export const removeLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;

    const lecture = await Lecture.findById(lectureId);

    await Lecture.findByIdAndDelete(lectureId);

    if (lecture?.course) {
      await Course.findByIdAndUpdate(lecture.course, {
        $pull: { lectures: lectureId },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lecture deleted",
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};



// ================= GET CREATOR =================
export const getCreatorById = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId).select("-password");

    return res.status(200).json(user);

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};


// ================= GET POPULAR COURSES =================
export const getPopularCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true });

    // sort by enrolled students count
    const sortedCourses = courses
      .sort(
        (a, b) =>
          (b.enrolledStudents?.length || 0) -
          (a.enrolledStudents?.length || 0)
      )
      .slice(0, 6); // top 6

    return res.status(200).json({
      success: true,
      data: sortedCourses,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};