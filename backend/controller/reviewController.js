import Course from "../model/courseModel.js";
import Review from "../model/reviewModel.js";


// ================= CREATE REVIEW =================
export const createReview = async (req, res) => {
  try {
    const { rating, comment, courseId } = req.body;
    const userId = req.userId;

    // 🔹 VALIDATION
    if (rating === undefined || !courseId) {
      return res.status(400).json({
        message: "Rating and CourseId are required",
      });
    }

    // 🔹 CHECK COURSE EXISTS
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // 🔹 PREVENT DUPLICATE REVIEW
    const alreadyReviewed = await Review.findOne({
      course: courseId,
      user: userId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        message: "You already reviewed this course",
      });
    }

    // 🔹 CREATE REVIEW (FIXED RATING)
    const review = new Review({
      course: courseId,
      user: userId,
      rating: Number(rating), // ✅ IMPORTANT FIX
      comment,
    });

    await review.save();

    // 🔹 ADD REVIEW TO COURSE
    if (!course.reviews) {
      course.reviews = [];
    }

    course.reviews.push(review._id);
    await course.save();

    // 🔹 RETURN POPULATED REVIEW
    const populatedReview = await Review.findById(review._id)
      .populate("user", "name photoUrl description")
      .populate("course", "title");

    return res.status(201).json({
      message: "Review added successfully",
      review: populatedReview,
    });

  } catch (error) {
    return res.status(500).json({
      message: `Create review error: ${error.message}`,
    });
  }
};



// ================= GET REVIEWS BY COURSE =================
export const getReviews = async (req, res) => {
  try {
    const { courseId } = req.params;

    const reviews = await Review.find({ course: courseId })
      .populate("user", "name photoUrl role description")
      .populate("course", "title")
      .sort({ createdAt: -1 });

    return res.status(200).json(reviews);

  } catch (error) {
    return res.status(500).json({
      message: `Get reviews error: ${error.message}`,
    });
  }
};



// ================= GET ALL REVIEWS =================
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate("user", "name photoUrl role description")
      .populate("course", "title")
      .sort({ createdAt: -1 });

    return res.status(200).json(reviews);

  } catch (error) {
    return res.status(500).json({
      message: `Get all reviews error: ${error.message}`,
    });
  }
};