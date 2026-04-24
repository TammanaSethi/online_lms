import React from "react";
import { FaStar } from "react-icons/fa6";
import { IoMdStarOutline } from "react-icons/io";

const ReviewCard = ({
  comment,
  rating,
  photoUrl,
  name,
  description,
  courseTitle,
}) => {
  // ✅ FIX: ensure rating is a number
  const numericRating = Math.min(Math.max(Number(rating), 0), 5);
  console.log("RATING VALUE:", rating);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 max-w-sm w-full">

      {/* ⭐ Stars */}
      <div className="flex items-center mb-3 text-yellow-400 text-sm">
        {[0, 1, 2, 3, 4].map((i) => (
  <span key={i}>
    {numericRating > i ? <FaStar /> : <IoMdStarOutline />}
  </span>
))}
      </div>

      {/* 📚 Course Title */}
      <p className="text-gray-700 text-sm mb-2">
        Review For: {courseTitle || "Course"}
      </p>

      {/* 💬 Comment */}
      <p className="text-gray-700 text-sm mb-5">
        {comment || "No comment provided"}
      </p>

      {/* 👤 User Info */}
      <div className="flex items-center gap-3">
        <img
          src={
            photoUrl && photoUrl.trim() !== ""
              ? photoUrl.startsWith("http")
                ? photoUrl
                : `http://localhost:8000/${photoUrl}`
              : "https://via.placeholder.com/40"
          }
          alt="user"
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => (e.target.src = "https://via.placeholder.com/40")}
        />

        <div>
          <h2 className="font-semibold text-gray-800 text-sm">
            {name || "User"}
          </h2>
          <p className="text-xs text-gray-500">
            {description || ""}
          </p>
        </div>
      </div>

    </div>
  );
};

export default ReviewCard;