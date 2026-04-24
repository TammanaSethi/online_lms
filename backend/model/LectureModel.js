import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
  lectureTitle: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String
  },
  isPreviewFree: {
    type: Boolean
  },
  course: {   // 🔥 ADD THIS
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  }
}, { timestamps: true });

const Lecture = mongoose.model("Lecture", lectureSchema);
export default Lecture;