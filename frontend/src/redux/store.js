import { configureStore } from "@reduxjs/toolkit";

// 🔹 IMPORT ALL SLICES
import userSlice from "./userSlice";
import courseSlice from "./courseSlice";
import lectureReducer from "./LecturesSlice";
import reviewReducer from "./reviewSlice";

// 🔹 CONFIGURE STORE
export const store = configureStore({
  reducer: {
    user: userSlice,
    course: courseSlice,
    lecture: lectureReducer,
    review: reviewReducer,
  },
});