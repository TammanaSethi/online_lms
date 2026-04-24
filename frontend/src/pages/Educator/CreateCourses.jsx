import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { serverUrl } from "../../App";

const CreateCourses = () => {
  const navigate = useNavigate();

  //  Backend URL (simple method)
  // const serverUrl = "http://localhost:8000";

  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  

  const handleNavigate = () => {
    navigate("/courses");
  };

  //  Handle form submit (BEST PRACTICE)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("inside submit");
      const result = await axios.post(
        serverUrl + "/api/course/create",
        { title, category }, { withCredentials: true }
      );

      console.log(result.data);
      // setLoading(false)
      toast.success("Course created successfully 🎉");

      // reset form
      // setTitle("");
      // setCategory("");

      // optional redirect
      navigate("/courses");

    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="max-w-xl w-[600px] mx-auto p-6 bg-white shadow-md rounded-md mt-10 relative">

        <FaArrowLeft
          className="top-[8%] absolute left-[5%] w-[22px] h-[22px] cursor-pointer"
          onClick={handleNavigate}
        />

        <h2 className="text-2xl font-semibold mb-6 text-center">
          Create Courses
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Title
            </label>
            <input
              type="text"
              value={title}
              placeholder="Enter course title"
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              required
            >
              <option value="">Select Category</option>
              <option value="App development">App Development</option>
              <option value="AI/ML">AI/ML</option>
              <option value="AI tools">AI Tools</option>
              <option value="Data Science">Data Science</option>
              <option value="Data Analytics">Data Analytics</option>
              <option value="Ethical Hacking">Ethical Hacking</option>
              <option value="UI UX designing">UI UX Designing</option>
              <option value="Web development">Web Development</option>
              <option value="Other category">Other Category</option>
            </select>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md active:bg-gray-800 transition flex justify-center items-center"
            disabled={loading} onSubmit={handleSubmit}
          >
            {loading ? <ClipLoader size={25} color="white" /> : "Create"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default CreateCourses;