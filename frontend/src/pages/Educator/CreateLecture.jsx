import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { setLectureData } from "../../redux/LecturesSlice"; // adjust path
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";

const CreateLecture = () => {
  console.log("URL:", window.location.pathname);
  const serverUrl = "http://localhost:8000";

  const { courseId } = useParams();
  console.log(courseId);
  console.log("courseId:", courseId);
  const navigate = useNavigate();

  const [lectureTitle, setLectureTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
const lectureData = useSelector((state) => state.lecture?.lectureData) || [];

console.log("LECTURE DATA FROM REDUX:", lectureData); 

const handleCreateLecture = async () => {
  setLoading(true);
  try {
    await axios.post(
      `${serverUrl}/api/course/createlecture/${courseId}`,
      { lectureTitle },
      { withCredentials: true }
    );

    toast.success("Lecture added");

    // 🔥 REFRESH DATA AFTER CREATE
    const result = await axios.get(
      `${serverUrl}/api/course/courselecture/${courseId}`,
      { withCredentials: true }
    );

    dispatch(setLectureData(result.data.lectures || []));

    setLectureTitle("");
  } catch (error) {
    console.log(error);
    toast.error(error?.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  const getCourseLecture = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/course/courselecture/${courseId}`,
        { withCredentials: true }
      );

      dispatch(setLectureData(result.data.lectures || []));
    } catch (error) {
      console.log("FETCH ERROR:", error);
    }
  };

  if (courseId) {
    getCourseLecture();
  }
}, [courseId, dispatch]);
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-2xl p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-1">
            Let's Add a Lecture
          </h1>
          <p className="text-sm text-gray-500">
            Enter title and add your video lectures
          </p>
        </div>

        <input
          type="text"
          className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black mb-4"
          placeholder="Introduction to MERN stack"
          onChange={(e) => setLectureTitle(e.target.value)}
          value={lectureTitle}
        />

        <div className="flex gap-4 mb-6">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-sm font-medium"
            onClick={() => navigate(`/editCourse/${courseId}`)}
          >
            <FaArrowLeftLong />
            Back to course
          </button>

          <button
            className="px-5 py-2 rounded-md bg-black text-white hover:bg-gray-600 transition-all text-sm font-medium shadow"
            disabled={loading}
            onClick={handleCreateLecture}
          >
            {loading ? (
              <ClipLoader size={30} color="white" />
            ) : (
              "Create Lecture"
            )}
          </button>
        </div>

        {/* lecture list */}
        <div  className="space-y-2">
          {lectureData?.map((lecture, index) => (
            <div  key={lecture._id}  className="bg-gray-100 rounded-md flex justify-between items-center p-3 text-sm font-medium text-gray-700">
           <span>Lecture-{index+1}:{lecture?.lectureTitle || "No title"}</span>
          <FaEdit className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => navigate(`/editLecture/${lecture._id}`)}/>
            </div>
          ))}
        </div>


      </div>
    </div>
  );
};

export default CreateLecture;
