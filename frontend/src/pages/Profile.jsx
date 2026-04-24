import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaArrowLeft } from "react-icons/fa";
const Profile = () => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/");
  };
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-xl w-full relative">
        <FaArrowLeft className="absolute top-[8%] left-[5%] w-[22px] h-[22px] cursor-pointer " onClick={handleNavigate} />
        <div className="flex flex-col items-center text-center">
          {userData?.photoUrl ? (
            <img
              src={userData?.photoUrl}
              alt=""
              className="w-24 h-24 rounded-full object-cover border-4 border-[black]"
            />
          ) : (
            <div className="w-24 h-24 rounded-full text-white flex items-center justify-center text-[30px] border-2 bg-black border-white">
              {(userData?.name?.slice(0, 1) || "").toUpperCase()}
            </div>
          )}

          <h2 className="text-2xl font-bold mt-4 text-gray-800">
            {userData?.name || "Unknown User"}
          </h2>
          <p className="text-sm text-gary-500">{userData?.role || "No role"}</p>
        </div>

        <div className="mt-6 space-y-4">
          <div className="text-sm flex items-center justify-start gap-1">
            <span className="font-semibold text-gray-700">Email:</span>
            <span>{userData?.email || "No email"}</span>
          </div>

          <div className="text-sm flex items-center  justify-start gap-1">
            <span className="font-semibold text-gray-700">Bio:</span>
            <span>{userData?.description || "No bio"}</span>
          </div>

          <div className="text-sm flex items-center  justify-start gap-1">
            <span className="font-semibold text-gray-700">
              Enrolled courses:
            </span>
            <span>
              {userData?.enrolledCourses?.length > 0
                ? userData.enrolledCourses.length
                : "No courses"}
            </span>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <button className="px-5 py-2 rounded bg-black text-white active:bg-[#4b4b4b] cursor-pointer transition" onClick={()=>navigate("/editprofile")}>
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;