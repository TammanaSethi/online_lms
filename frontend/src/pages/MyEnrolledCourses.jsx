import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";

const MyEnrolledCourses = () => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full px-4 py-9 bg-gray-50">

      {/* 🔙 BACK BUTTON */}
      <FaArrowLeftLong
        className="absolute top-[3%] md:top-[6%] left-[5%] h-[22px] cursor-pointer"
        onClick={() => navigate("/")}
      />

      <h1 className="text-3xl text-center font-bold text-gray-800 mb-6">
        My enrolled courses
      </h1>

      {userData?.enrolledCourses?.length === 0 ? (
        <p className="text-gray-500 text-center w-full">
          You have not enrolled in any course yet
        </p>
      ) : (
        <div className="flex items-center justify-center flex-wrap gap-[30px]">

          {userData.enrolledCourses.map((course, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md overflow-hidden border w-[280px]"
            >

              {/* ✅ FIXED IMAGE */}
              <img
                src={
                  course?.thumbnail && course.thumbnail.trim() !== ""
                    ? course.thumbnail.startsWith("http")
                      ? course.thumbnail
                      : `http://localhost:8000/${course.thumbnail}`
                    : "https://via.placeholder.com/300x200?text=Course"
                }
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/300x200?text=Course";
                }}
                className="w-full h-40 object-cover rounded-t-2xl bg-gray-100"
                alt="course"
              />

              <div className="p-4">

                {/* 📚 TITLE */}
                <h2 className="text-lg font-semibold text-gray-800">
                  {course?.title}
                </h2>

                {/* 🏷 CATEGORY */}
                <p className="text-sm text-gray-600 mb-1">
                  {course?.category}
                </p>

                {/* 📊 LEVEL */}
                <p className="text-sm text-gray-600 mb-2">
                  {course?.level}
                </p>

                {/* ▶ WATCH BUTTON */}
                <button
                  className="w-full py-2 bg-black text-white rounded-lg text-sm cursor-pointer hover:bg-gray-600 mt-3"
                  onClick={() => navigate(`/viewlecture/${course._id}`)}
                >
                  Watch Now
                </button>

              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default MyEnrolledCourses;