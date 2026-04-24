import React from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import img from "../../assets/empty.jpg";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import { setCreatorCourseData } from "../../redux/courseSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../../App";

const Courses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const { creatorCourseData } = useSelector((state) => state.course);

  const handlenav = (course) => {
    navigate(`/editcourse/${course?._id}`);
  };

  useEffect(() => {
    const creatorCourses = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/course/getcreator", {
          withCredentials: true,
        });
        dispatch(setCreatorCourseData(result.data.data));
      } catch (error) {
        console.log(error);
      }
    };
    creatorCourses();
  }, [userData, dispatch]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-[100%] min-h-screen p-4 sm:p-6 bg-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <div className="flex items-center justify-center gap-3">
            <FaArrowLeftLong
              className="w-[22px] h-[22px] cursor-pointer"
              onClick={() => navigate("/dashboard")}
            />
            <h1 className="text-2xl font-semibold">All Created Courses</h1>
          </div>

          <button
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-500"
            onClick={() => navigate("/createcourse")}
          >
            Create Course
          </button>
        </div>

        {/* ================= DESKTOP ================= */}
        <div className="hidden md:block bg-white rounded-xl shadow p-4 overflow-x-auto">
          <table className="min-w-full text-5m">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4">Courses</th>
                <th className="text-left py-3 px-4">Price</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {creatorCourseData?.map((course, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition duration-200"
                >
                  <td className="py-3 px-4 flex items-center gap-4">

                    {/* ✅ FIXED IMAGE */}
                    <img
                      src={
                        course?.thumbnail &&
                        typeof course.thumbnail === "string" &&
                        course.thumbnail.trim() !== ""
                          ? course.thumbnail.startsWith("http")
                            ? course.thumbnail
                            : `${serverUrl}/${course.thumbnail}`
                          : img
                      }
                      onError={(e) => (e.target.src = img)}
                      alt="course"
                      className="w-16 h-16 rounded-md object-cover"
                    />

                    <span>{course?.title}</span>
                  </td>

                  {course?.price ? (
                    <td className="py-3 px-4 ">Rs.{course?.price}</td>
                  ) : (
                    <td className="px-4 py-3">Rs. NA</td>
                  )}

                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        course.isPublished
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {course.isPublished ? "published" : "Draft"}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <FaEdit
                      className="text-gray-600 hover:text-blue-600 cursor-pointer"
                      onClick={() => handlenav(course)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="text-center text-sm text-gray-400 mt-6">
            A list of your recent courses
          </p>
        </div>

        {/* ================= MOBILE ================= */}
        <div className="md:hidden space-y-4">
          {creatorCourseData?.map((course, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow p-4 flex flex-col gap-3"
            >
              <div className="flex gap-4 items-center">

                {/* ✅ FIXED IMAGE (MAIN ISSUE) */}
                <img
                  src={
                    course?.thumbnail &&
                    typeof course.thumbnail === "string" &&
                    course.thumbnail.trim() !== ""
                      ? course.thumbnail.startsWith("http")
                        ? course.thumbnail
                        : `${serverUrl}/${course.thumbnail}`
                      : img
                  }
                  onError={(e) => (e.target.src = img)}
                  alt="course"
                  className="w-16 h-16 rounded-md object-cover"
                />

                <div className="flex-1">
                  <h2 className="font-medium text-sm">
                    {course?.title}
                  </h2>

                  {course?.price ? (
                    <p className="text-gray-600 text-xs mt-1">
                      Rs.{course?.price}
                    </p>
                  ) : (
                    <p className="text-gray-600 text-xs mt-1">Rs. NA</p>
                  )}
                </div>

                <FaEdit
                  className="text-gray-600 hover:text-blue-600 cursor-pointer"
                  onClick={() => handlenav(course)}
                />
              </div>

              <span
                className={`w-fit px-3 py-1 text-xs rounded-full ${
                  course?.isPublished
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {course.isPublished ? "published" : "Draft"}
              </span>
            </div>
          ))}

          <p className="text-center text-sm text-gray-400 mt-4 pl-[80px]">
            A list of your recent courses
          </p>
        </div>
      </div>
    </div>
  );
};

export default Courses;