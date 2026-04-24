import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reviewData: [],   // all reviews
  loading: false,
  error: null,
};

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {

    // 🔹 SET ALL REVIEWS
    setReviewData: (state, action) => {
      state.reviewData = action.payload;
    },

    // 🔹 ADD NEW REVIEW (after submit)
    addReview: (state, action) => {
      state.reviewData.unshift(action.payload);
    },

    // 🔹 LOADING STATE
    setReviewLoading: (state, action) => {
      state.loading = action.payload;
    },

    // 🔹 ERROR STATE
    setReviewError: (state, action) => {
      state.error = action.payload;
    },

    // 🔹 CLEAR REVIEWS (optional)
    clearReviews: (state) => {
      state.reviewData = [];
    },
  },
});

export const {
  setReviewData,
  addReview,
  setReviewLoading,
  setReviewError,
  clearReviews,
} = reviewSlice.actions;

export default reviewSlice.reducer;