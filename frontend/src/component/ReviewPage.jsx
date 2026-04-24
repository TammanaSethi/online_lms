import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import ReviewCard from "./ReviewCard";

import {
  setReviewData,
  setReviewLoading,
  setReviewError,
} from "../redux/reviewSlice";

const ReviewPage = () => {
  const dispatch = useDispatch();
  const { reviewData, loading } = useSelector((state) => state.review);
  const [latestReview, setLatestReview] = useState([]);

  const serverUrl = "http://localhost:8000";

  // 🔥 FETCH REVIEWS
  useEffect(() => {
    const fetchReviews = async () => {
      dispatch(setReviewLoading(true));

      try {
        const res = await axios.get(`${serverUrl}/api/review`);

        console.log("API DATA:", res.data); // DEBUG

        // ✅ store correct data
        dispatch(setReviewData(res.data));

        dispatch(setReviewError(null));
      } catch (error) {
        dispatch(setReviewError("Failed to fetch reviews"));
      } finally {
        dispatch(setReviewLoading(false));
      }
    };

    fetchReviews();
  }, [dispatch]);

  // 🔥 FILTER VALID REVIEWS (IMPORTANT FIX)
  useEffect(() => {
    if (Array.isArray(reviewData)) {
      const validReviews = reviewData.filter(
        (review) => review.course !== null
      );

      setLatestReview(validReviews.slice(0, 6));
    }
  }, [reviewData]);

  return (
    <div className="flex items-center justify-center flex-col">

      <h1 className="md:text-[45px] text-[30px] font-semibold text-center mt-[30px] px-[20px]">
        Real reviews for Real Courses
      </h1>

      <span className="lg:w-[50%] md:w-[80%] text-[15px] text-center mt-[30px] mb-[30px] px-[20px]">
        Discover how our virtual courses is transforming learning experience
      </span>

      {/* 🔄 Loading */}
      {loading && <p className="text-gray-500">Loading...</p>}

      {/* ❌ No Reviews */}
      {!loading && latestReview.length === 0 && (
        <p className="text-gray-500">No reviews found</p>
      )}

      <div className="w-full min-h-[100vh] flex flex-wrap gap-[50px] justify-center">

        {latestReview.map((review) => (
          <ReviewCard
            key={review._id}
            comment={review.comment}
            rating={review.rating}
            photoUrl={review.user?.photoUrl}
            name={review.user?.name}
            description={review.user?.description}
            courseTitle={review.course?.title || "Unknown Course"}
          />
        ))}

      </div>
    </div>
  );
};

export default ReviewPage;