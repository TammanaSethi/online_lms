import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  creatorCourseData: [],
  courseData: [],           // ✅ NEW
  selectedCourse: null,
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setCreatorCourseData: (state, action) => {
      state.creatorCourseData = action.payload;
    },

    setCourseData: (state, action) => {
      state.courseData = action.payload;   // ✅ FIXED
    },

    setSelectedCourse: (state, action) => {
      state.selectedCourse = action.payload;
    },

    logoutCourse: (state) => {
      state.creatorCourseData = [];
      state.courseData = [];               // ✅ CLEAR BOTH
      state.selectedCourse = null;
    },
  },
});

export const {
  setCreatorCourseData,
  setCourseData,
  setSelectedCourse,
  logoutCourse,
} = courseSlice.actions;

export default courseSlice.reducer;