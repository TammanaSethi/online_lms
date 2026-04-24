import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCourseData } from "../redux/courseSlice";

const getPublishedCourses = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/course/published",
          { withCredentials: true } // 🔥 IMPORTANT
        );

        dispatch(setCourseData(res.data.data));
      } catch (error) {
        console.log("ERROR:", error);
      }
    };

    fetchCourses();
  }, [dispatch]);
};

export default getPublishedCourses;