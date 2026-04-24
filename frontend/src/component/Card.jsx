import React from "react";
import { FaStar } from "react-icons/fa6";
import img from "../assets/empty.jpg";
import { useNavigate } from "react-router-dom";

const Card = ({ thumbnail, title, category, price, id, reviews, isEnrolled }) => {
  const navigate = useNavigate();

  const avgRating =
    reviews && reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  return (
    <div
      className="max-w-sm w-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border cursor-pointer"
      onClick={() => navigate(`/viewCourse/${id}`)}
    >
      {/* ✅ FIX IMAGE (no crop issue) */}
      <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center">
        <img
          src={
            thumbnail && thumbnail.trim() !== ""
              ? thumbnail.startsWith("http")
                ? thumbnail
                : `http://localhost:8000/${thumbnail}`
              : img
          }
          onError={(e) => (e.target.src = img)}
          className="max-h-full max-w-full object-contain"
        />

        {/* ✅ ENROLLED BADGE */}
        {isEnrolled && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md font-medium">
            Enrolled
          </span>
        )}
      </div>

      <div className="p-5 space-y-2">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>

        <span className="px-2 py-0.5 bg-gray-100 rounded-full text-gray-700 capitalize">
          {category}
        </span>

        <div className="flex justify-between text-sm text-gray-600 mt-3 px-[10px]">
          <span className="font-semibold text-gray-800">₹{price}</span>
          <span className="flex items-center gap-1">
            <FaStar className="text-yellow-500" />
            {avgRating}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Card;