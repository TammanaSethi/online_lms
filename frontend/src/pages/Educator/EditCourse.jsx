import React from "react";
import { useRef } from "react";
import { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import img from "../../assets/empty.jpg";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { setCourseData } from "../../redux/courseSlice";
import { setCreatorCourseData } from "../../redux/courseSlice";

const EditCourse = () => {
  const navigate = useNavigate();

  const { courseId } = useParams();

  // const { id: courseId } = useParams();
  console.log(courseId);

  const handleNavigate = () => {
    navigate("/courses");
  };
  const handlePublish = () => {
    setIsPublished((prev) => !prev);
  };
  const thumb = useRef();

  const handleImg = () => {
    thumb.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleEditCourse();
  };
  const [isPublished, setIsPublished] = useState(false);
  const [selectCourse, setSelectCourse] = useState(null);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [price, setPrice] = useState("");

  const [frontendImage, setFrontendImage] = useState(img);
  const [backendImage, setBackendImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);

  const dispatch = useDispatch();
  const { creatorCourseData: courseData } = useSelector(
    (state) => state.course,
  );

const handleThumbnail = (e) => {
  const file = e.target.files[0];
  console.log("SELECTED FILE:", file);
  setBackendImage(file);
  setFrontendImage(URL.createObjectURL(file));
};
  const serverUrl = "https://online-lms-xnob.onrender.com";

  const getCourseById = async () => {
    try {
      const result = await axios.get(serverUrl + `/api/course/getcourse/${courseId}`, {
        withCredentials: true,
      });
      setSelectCourse(result.data.data);
      console.log("jdhdjh", result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
     console.log("THUMBNAIL FROM DB:", selectCourse?.thumbnail);
    if (selectCourse) {
     
      console.log("kjfjkS", selectCourse);
      setTitle(selectCourse.title || "");
      setSubTitle(selectCourse.subTitle || "");
      setDescription(selectCourse.description || "");
      setLevel(selectCourse.level || "");
      setPrice(selectCourse.price || "");
      setFrontendImage(
  selectCourse.thumbnail && selectCourse.thumbnail.trim() !== ""
    ? selectCourse.thumbnail.startsWith("http")
      ? selectCourse.thumbnail
      : `http://localhost:8000/${selectCourse.thumbnail}`
    : img
);
      setIsPublished(selectCourse?.isPublished);
      setCategory(selectCourse.category || "");
    }
  }, [selectCourse]);

  useEffect(() => {
    if (courseId) {
      getCourseById();
    }
  }, [courseId]);

const handleEditCourse = async () => {
  try {
    setLoading(true);

    const formData = new FormData();

    formData.append("title", title);
    formData.append("subTitle", subTitle);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("level", level);
    formData.append("price", price);

    // ✅ ADD THIS (MAIN FIX)
    formData.append("isPublished", isPublished);

    if (backendImage) {
      formData.append("thumbnail", backendImage);
    }

    const result = await axios.post(
      serverUrl + `/api/course/editcourse/${courseId}`,
      formData,
      { withCredentials: true }
    );

    toast.success(result.data.message);

    setLoading(false);

    setTimeout(() => {
      navigate("/courses");
    }, 800);

  } catch (error) {
    console.log(error);
    setLoading(false);
    toast.error("Something went wrong");
  }
};
  const handleRemoveCourse = async () => {
    setLoading1(true);
    try {
      const result = await axios.delete(serverUrl + `/api/course/getcourse/${courseId}`, {
        withCredentials: true,
      });
      console.log(result.data);
      const filterCourse = courseData.filter((c) => c._id !== courseId);

      dispatch(setCourseData(filterCourse));
      setLoading1(false);
      toast.success("course removed");
      navigate("/Courses");
    } catch (error) {
      console.log(error);
      setLoading1(false);
      toast.error(error.response.data.message);
    }
  };

const handleLecture = () => {
  console.log("BUTTON CLICKED");
  console.log("FULL DATA:", selectCourse);

  const id = selectCourse?._id || selectCourse?.data?._id;

  console.log("ID:", id);

  if (!id) {
    toast.error("Course not loaded yet");
    return;
  }

  navigate(`/createlecture/${id}`);
};
  useEffect(() => {
  console.log("SELECT COURSE:", selectCourse);
}, [selectCourse]);
  return (
    <div className="max-w-5xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-md">
      {/* top bar */}
      <div className="flex items-center justify-center gap-[20px]  md:justify-between flex-col md:flex-row mb-6 relative">
        <FaArrowLeftLong
          className="top-[-20%] md:top-[20%] absolute left-[0] md:left-[2%] w-[22px] h-[22px] cursor-pointer"
          onClick={handleNavigate}
        />

        <h2 className="text-2xl font-semibold md:pl-[60px]">
          Add Detail Information recarding the course
        </h2>
        <div className="space-x-2 space-y-2">
          <button
            className="bg-black text-white px-4 py-2 rounded-md"
            // disabled={!selectCourse}
            onClick={handleLecture}
          >
            Go to Lecture page
          </button>
        </div>
      </div>

      {/* form details */}
      <div className="bg-gray-50 p-6 rounded-md">
        <h2 className="text-lg font-medium mb-4">Basic course Information</h2>
        <div className="space-x-2 space-y-2">
          {!isPublished ? (
            <button
              className="bg-green-100 text-green-600 px-4 py-2 rounded-md border-1"
              onClick={handlePublish}
            >
              Click to publish
            </button>
          ) : (
            <button
              className="bg-red-100 text-red-600 px-4 py-2 rounded-md border-1"
              onClick={handlePublish}
            >
              Click to unPublish
            </button>
          )}

          <button
            className="bg-red-600 text-white px-4 py-2 rounded-md"
            onClick={handleRemoveCourse}
          >
            Remove Course
          </button>
        </div>

        {/* <form onSubmit={handleSubmit}> */}
        {/* <form className="space-y-6" onSubmit={(e)=>e.preventDefault()}> */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="title"
              className="block text-5m font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              className="w-full border px-4 py-2 rounded-md"
              placeholder="CourseTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="subtitle"
              className="block text-5m font-medium text-gray-700 mb-1"
            >
              subtitle
            </label>
            <input
              id="subtitle"
              type="text"
              className="w-full border px-4 py-2 rounded-md"
              placeholder="Course Subtitle"
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="des"
              className="block text-5m font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="des"
              type="text"
              className="w-full border px-4 py-2 rounded-md h-24 resize-none"
              placeholder=" Course Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            {/* for categories */}
            <div className="flex-1">
              <label
                htmlFor=""
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Course Category
              </label>
              <select
                name=""
                id=""
                className="w-full border px-4 py-2 rounded-md bg-white"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Course Category</option>
                <option value="App development">App Development</option>
                <option value="AI/ML">AI/ML</option>
                <option value="AI tools">AI Tools</option>
                <option value="Data Science">Data Science</option>
                <option value="Data Analytics">Data Analytics</option>
                <option value="Ethical Hacking">Ethical Hacking</option>
                <option value="UI UX designing">UI/UX Designing</option>
                <option value="Web development">Web Development</option>
                <option value="Other category">Other Category</option>
              </select>
            </div>

            {/* for level */}
            <div className="flex-1">
              <label
                htmlFor=""
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Course level
              </label>
              <select
                name=""
                id=""
                className="w-full border px-4 py-2 rounded-md bg-white"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value="">Course level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* for price */}
            <div className="flex-1">
              <label
                htmlFor=""
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Course Price(INR)
              </label>
              <input
                type="number"
                id="price"
                className="w-full border px-4 py-2 rounded-md"
                placeholder="Rs."
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor=""
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Course thumbnail
            </label>
            <input
              type="file"
              hidden
              ref={thumb}
              accept="image/*"
              onChange={handleThumbnail}
            />
          </div>

          <div className="relative w-[300px] h-[170px]">
           <img
  src={frontendImage}
  onError={(e) => (e.target.src = img)} // 🔥 fallback
  alt="thumbnail"
  className="w-[100%] h-[100%] border border-black rounded-[5px]"
/>
            <FaEdit
              className="w-[20px] h-[20px] absolute top-2 right-2"
              onClick={handleImg}
            />
          </div>

          <div className="flex items-center justify-start gap-[15x]">
            <button
              type="button"
              className="bg-red-600 text-white hover:bg-red-200  border-1 border-black cursor-pointer px-4 py-2 rounded-md mt-4 mx-3"
              onClick={handleNavigate}
            >
              Cancel
            </button>

            <button type="submit" className="bg-green-100 text-green-600 border-1 px-7 py-2 rounded-md hover:bg-gray-500 cursor-pointer mt-4">
              {loading ? <ClipLoader size={30} color="white" /> : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourse;
