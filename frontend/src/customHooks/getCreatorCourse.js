import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCreatorCourseData } from "../redux/courseSlice";

const getCreatorCourse = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userData) return; // ❗ WAIT until user loads

    const fetchCourses = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/course/getcreator",
          { withCredentials: true }
        );

        console.log("CREATOR COURSES:", res.data);

        dispatch(setCreatorCourseData(res.data.data));

      } catch (error) {
        console.log(error);
      }
    };

    fetchCourses();
  }, [dispatch, userData]); // ✅ DEPENDS ON user
};

export default getCreatorCourse;