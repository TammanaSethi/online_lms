import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const Dashboard = () => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const { creatorCourseData } = useSelector((state) => state.course);

  const courseProgressData =
    creatorCourseData?.map((course) => ({
      name:
        course.title?.length > 10
          ? course.title.slice(0, 10) + "..."
          : course.title,
      lectures: course.lectures?.length || 0,
    })) || [];

  const EnrollData =
    creatorCourseData?.map((course) => ({
      name: course.title?.slice(0, 10) + "...",
      enrolled: course.enrolledStudents?.length || 0,
    })) || [];


 const totalEarning = creatorCourseData?.reduce((sum, course) => {
  const studentCount = course.enrolledStudents?.length || 0;
  const courseRevenue = course.price ? course.price * studentCount : 0;

  return sum + courseRevenue;
}, 0) || 0;


  return (
    <div className="flex min-h-screen bg-gray-100">
      <FaArrowLeftLong
        className="w-[22px] absolute top-[10%] left-[10%] h-[22px] cursor-pointer"
        onClick={() => navigate("/")}
      />

      <div className="w-full px-6 py-10 bg-gray-50 space-y-10">
        {/* main section */}
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row items-center gap-6">
          {userData?.photoUrl ? (
            <img
              src={userData.photoUrl}
              className="w-28 h-28 rounded-full object-cover border-4 border-black shadow-md"
              alt="Educator"
            />
          ) : (
            <div className="w-28 h-28 rounded-full flex items-center justify-center border-4 border-black shadow-md bg-gray-300 text-3xl font-bold">
              {userData?.name?.slice(0, 1)?.toUpperCase()}
            </div>
          )}

          <div className="text-center md:text-left space-y-1">
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome, {userData?.name || "Educator"} 👋
            </h1>

            <h1 className="text-xl font-semibold text-gray-800">
              Total Earning: Rs.{totalEarning . toLocaleString()}
            </h1>

            <p className="text-gray-600 text-sm">
              {userData?.description ||
                "Start creating courses for your students"}
            </p>

            <button
              className="px-[10px] py-[10px] border-black border-2 bg-black text-white rounded-[10px] text-[15px] font-light cursor-pointer"
              onClick={() => navigate("/courses")}
            >
              Create Courses
            </button>
          </div>
        </div>

        {/* graph section */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* for course progress graph */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">
              Course Progress (Lectures)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={courseProgressData}
                margin={{ top: 10, right: 20, left: 0, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="name"
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                />

                <YAxis />
                <Tooltip />
                <Bar dataKey="lectures" fill="black" radius={[5,5,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>



          {/* enrolled data */}


           <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">
              Students Enrollement 
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={EnrollData}
                margin={{ top: 10, right: 20, left: 0, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="name"
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                />

                <YAxis />
                <Tooltip />
                <Bar dataKey="enrolled" fill="black" radius={[5,5,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>


        </div>
      </div>
    </div>
  );
};

export default Dashboard;
