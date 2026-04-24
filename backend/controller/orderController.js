import Razorpay from "razorpay";
import crypto from "crypto";
import Course from "../model/courseModel.js";
import User from "../model/userModel.js";

// ✅ LAZY INIT (FIXED)
const getRazorpayInstance = () => {
  console.log("🔑 ENV CHECK:", process.env.RAZORPAY_KEY_ID);

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay keys not found in .env");
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID.trim(),
    key_secret: process.env.RAZORPAY_KEY_SECRET.trim(),
  });
};

// ================= CREATE ORDER =================
export const RazorpayOrder = async (req, res) => {
  try {
    console.log("👉 ORDER BODY:", req.body);

    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "CourseId is required",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (!course.price || course.price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid course price",
      });
    }

    console.log("💰 COURSE PRICE:", course.price);

    const options = {
      amount: course.price * 100,
      currency: "INR",
      receipt: courseId.toString(),
    };

    // ✅ FIXED HERE
    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {
    console.log("❌ RAZORPAY ORDER ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= VERIFY PAYMENT =================
export const verifyPayment = async (req, res) => {
  try {
    const {
      courseId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const userId = req.userId;

    if (
      !courseId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing payment details",
      });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET.trim())
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user || !course) {
      return res.status(404).json({
        success: false,
        message: "User or Course not found",
      });
    }

    if (!user.enrolledCourses.includes(courseId)) {
      user.enrolledCourses.push(courseId);
      await user.save();
    }

    if (!course.enrolledStudents.includes(userId)) {
      course.enrolledStudents.push(userId);
      await course.save();
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified & enrolled successfully",
    });

  } catch (error) {
    console.log("❌ VERIFY PAYMENT ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};