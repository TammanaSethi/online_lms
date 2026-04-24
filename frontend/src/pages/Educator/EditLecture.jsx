import React, { useState,useEffect } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import axios from "axios"
import { setLectureData } from "../../redux/LecturesSlice"; // adjust path


const EditLecture = () => {
    const serverUrl = "https://online-lms-xnob.onrender.com";

  const { lectureId } = useParams(); 
  // const { lectureId, courseId } = useParams();
  const { lectureData } = useSelector((state) => state.lecture);
  const selectedLecture = lectureData?.find(
    (lecture) => lecture._id === lectureId,
  );

  // const courseId = selectedLecture?.course; 
  const navigate = useNavigate();
  const [lectureTitle, setLectureTitle] = useState("");
  const [videoUrl, setvideoUrl] = useState(null);
  const [isPreviewFree, setIsPreviewFree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const dispatch = useDispatch();

  
const handleEditLecture = async () => {
  try {
    setLoading(true);

const formData = new FormData();

formData.append("lectureTitle", lectureTitle || "");
formData.append("isPreviewFree", isPreviewFree.toString());

if (videoUrl && videoUrl instanceof File) {
  formData.append("videoUrl", videoUrl);
}
    const result = await axios.put(
      `${serverUrl}/api/course/editlecture/${lectureId}`,
      formData,
      {
        withCredentials: true
      }
    );

    console.log(result.data);

    const updatedLectures = lectureData.map((lec) =>
      lec._id === lectureId ? result.data.lecture : lec
    );

    dispatch(setLectureData(updatedLectures));

    toast.success("Lecture updated successfully");
    navigate(-1);

  } catch (error) {
    console.log(error);
    toast.error(error?.response?.data?.message || "Error");
  } finally {
    setLoading(false);
  }
};


const [courseIdState, setCourseIdState] = useState("");


useEffect(() => {
  if (selectedLecture) {
    setLectureTitle(selectedLecture.lectureTitle || "");
    setIsPreviewFree(selectedLecture.isPreviewFree || false);
    setCourseIdState(selectedLecture.course || "");
  }
}, [selectedLecture]);

const removeLecture=async()=>{
  setLoading1(true);
  try {
    const result=await axios.delete(serverUrl + `/api/course/removelecture/${lectureId}`,{withCredentials: true})
    console.log(result.data);
    setLoading1(false);
   navigate(`/createlecture/${courseIdState}`)
    toast.success("Lecture Removed");
    
    
  } catch (error) {
    setLoading1(false);
    console.log(error.message);
   toast.error(error?.response?.data?.message || "Error deleting lecture");
  }
}

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <FaArrowLeftLong
            className="text-gray-600 cursor-pointer"
            onClick={() => navigate(-1)} // ✅ go back
          />

          <h2 className="text-xl font-semibold text-gray-800">
            Update Course Lecture
          </h2>
        </div>

        {/* input */}
        <button className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-a text-sm" disabled={loading1} onClick={removeLecture}>
          { loading1? <ClipLoader size={30} color="white"/>: "Remove Lecture"}
        </button>

        <div className="space-y-4">
          <div>
            <label
              htmlFor=""
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Lecture title *
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[black] focus:outline-none"
              onChange={(e) => setLectureTitle(e.target.value)}
              value={lectureTitle || ""}
              required
            />
          </div>

          <div>
            <label
              htmlFor=""
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Video *
            </label>
            <input
              type="file"
              className="w-full border boder-gray-300 rounded-md p-2 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-gray-700 file:text-white hover:file:bg-gray-500"
              
              accept="video/*"
              onChange={(e) => setvideoUrl(e.target.files[0])}
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              className="accent-black h-4 w-4"
              id="isFree"
               checked={isPreviewFree}
             onChange={(e) => setIsPreviewFree(e.target.checked)}
            />
            <label htmlFor="isFree">Is this video FREE ?</label>
          </div>
         {loading ? <p>Uplading video...please wait.</p>: ""}

        </div>

        <div className="pt-4">
          <button className="w-full bg-black text-white py-3 rounded-md text-sm font-medium hover:bg-gary-700 transition" disabled ={loading} onClick={handleEditLecture}>{loading ? <ClipLoader size={30} color="white"/>:
           " Update Lecture"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditLecture;
