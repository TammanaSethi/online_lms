import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";

import {
  setReviewData,
  setReviewLoading,
  setReviewError,
} from "../redux/reviewSlice";

const useGetCourseReviews = (courseId) => {
  const dispatch = useDispatch();
  const serverUrl = "http://localhost:8000";

  useEffect(() => {
  
    if (!courseId) return;

    const fetchReviews = async () => {
      dispatch(setReviewLoading(true));

      try {
        const res = await axios.get(
          `${serverUrl}/api/review/${courseId}`,
          {
            withCredentials: true,
          }
        );

        dispatch(setReviewData(res.data));
        dispatch(setReviewError(null));

      } catch (error) {
        dispatch(
          setReviewError(
            error.response?.data?.message || "Failed to fetch reviews"
          )
        );
      } finally {
        dispatch(setReviewLoading(false));
      }
    };

    fetchReviews();
  }, [courseId, dispatch]);
};

export default useGetCourseReviews;