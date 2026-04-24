import dotenv from "dotenv";
dotenv.config(); // 🔥 ADD THIS

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// ✅ configure once
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) {
      console.log("❌ No file path");
      return null;
    }

    console.log("📂 Uploading file:", filePath);

    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    console.log("✅ Cloudinary Success:", result.secure_url);

    // delete file after upload
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return result.secure_url;

  } catch (error) {
    console.log("❌ CLOUDINARY ERROR:", error.message);

    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return null;
  }
};

export default uploadOnCloudinary;