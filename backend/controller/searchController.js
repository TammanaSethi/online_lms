import Course from "../model/courseModel.js";

export const searchWithAi = async (req, res) => {
  try {
    const { input } = req.body;

    if (!input || !input.trim()) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    // ✅ escape regex (important)
    const escapedInput = input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const courses = await Course.find({
      isPublished: true,
      $or: [
        { title: { $regex: escapedInput, $options: "i" } },
        { subTitle: { $regex: escapedInput, $options: "i" } },
        { description: { $regex: escapedInput, $options: "i" } },
        { category: { $regex: escapedInput, $options: "i" } },
        { level: { $regex: escapedInput, $options: "i" } },
      ],
    }).limit(10); // ✅ like Google (limit results)

    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};