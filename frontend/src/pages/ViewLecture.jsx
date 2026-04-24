import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoIosPlayCircle } from "react-icons/io";
import { setSelectedCourse } from "../redux/courseSlice";

const ViewLecture = () => {
  const serverUrl = "http://localhost:8000";
  const { courseId } = useParams();
  const { selectedCourse } = useSelector((state) => state.course);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [creatorData, setcreatorData] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);

  // ✅ FETCH COURSE WITH LECTURES
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/course/getcourse/${courseId}`,
          { withCredentials: true }
        );

        dispatch(setSelectedCourse(res.data.data));

        if (res.data.data.lectures?.length > 0) {
          setSelectedLecture(res.data.data.lectures[0]);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchCourse();
  }, [courseId]);

  // ✅ FETCH CREATOR (FIXED creater field)
  useEffect(() => {
    const handlecreator = async () => {
      if (selectedCourse?.creater) {
        try {
          const result = await axios.post(
            serverUrl + "/api/course/creater",
            { userId: selectedCourse.creater },
            { withCredentials: true }
          );
          setcreatorData(result.data);
        } catch (error) {
          console.log(error.message);
        }
      }
    };

    handlecreator();
  }, [selectedCourse]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col md:flex-row gap-6">
      
      {/* LEFT SECTION */}
      <div className="w-full md:w-4/3 bg-white rounded-2xl shadow-md p-6 border border-gray-200">
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold flex items-center justify-start gap-[20px] text-gray-800">
            <FaArrowLeftLong
              className="text-black w-[22px] h-[22px] cursor-pointer"
              onClick={() => navigate("/")}
            />
            {selectedCourse?.title}
          </h2>

          <div className="mt-2 flex gap-4 text-sm text-gray-500 font-medium">
            <span>Category:{selectedCourse?.category}</span>
            <span>Level:{selectedCourse?.level}</span>
          </div>
        </div>

        {/* VIDEO PLAYER */}
        <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4 border border-gray-300">
          {selectedLecture?.videoUrl ? (
            <video
              className="w-full h-full object-cover"
              src={`http://localhost:8000/${selectedLecture?.videoUrl}`}
              controls
            />
          ) : (
            <div className="flex items-center justify-center h-full text-white">
              Select lecture to start watching
            </div>
          )}
        </div>

        <div className="mt-2">
          <h2 className="text-xl font-semibold text-gray-800">
            {selectedLecture?.lectureTitle}
          </h2>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="w-full md:1/3 bg-white rounded-2xl shadow p-6 border border-gray-200 h-fit">
        
        <h2 className="text-xl font-bold mb-gray">All lectures</h2>

        <div className="flex flex-col gap-3 mb-6">
          {selectedCourse?.lectures?.length > 0 ? (
            selectedCourse.lectures.map((lecture, index) => (
              <button
                key={index}
                onClick={() => setSelectedLecture(lecture)}
                className={`flex items-center justify-between p-3 rounded-lg border transition text-left ${
                  selectedLecture?._id === lecture._id
                    ? "bg-gray-200 border-gray-500"
                    : "hover:bg-gray-50"
                }`}
              >
                <h2>{lecture.lectureTitle}</h2>
                <IoIosPlayCircle className="text-lg text-black" />
              </button>
            ))
          ) : (
            <p className="text-gray-500">No lecture available</p>
          )}
        </div>

        {/* ✅ EDUCATOR SECTION (FIXED IMAGE ISSUE) */}
        {creatorData && (
          <div className="mt-4 border-t pt-4">
            <h3 className="text-md font-semibold text-gray-700 mb-3">
              Educator
            </h3>

            <div className="flex items-center gap-4">
              
              {creatorData?.photoUrl ? (
                <img
                  src={creatorData.photoUrl}
                  className="w-14 h-14 rounded-full object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded-full flex items-center justify-center bg-black text-white">
                  {creatorData?.name?.charAt(0)?.toUpperCase()}
                </div>
              )}

            </div>

            <div>
              <h2 className="text-base font-medium text-gray-800">
                {creatorData?.name}
              </h2>
              <p className="text-sm text-gray-600">
                {creatorData?.description}
              </p>
              <p className="text-sm text-gray-600">
                {creatorData?.email}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewLecture;