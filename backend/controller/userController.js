import uploadOnCloudinary from "../config/cloudinary.js"
import User from "../model/userModel.js"


export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password").populate("enrolledCourses")
    if(!user){
      return res.status(404).json({message:"User not found"})
    }
    return res.status(200).json(user)
  } catch (error) {
      return res.status(500).json({message:`GetCurrentUser error ${error}`})
  }
}
export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { description, name } = req.body;

    const updateData = {
      name,
      description
    };

    if (req.file) {
      updateData.photoUrl = await uploadOnCloudinary(req.file.path);
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);

  } catch (error) {
    return res.status(500).json({ message: `updateProfile error ${error}` });
  }
};