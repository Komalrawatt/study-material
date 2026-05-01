import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import courseReducer from "./slices/courseSlice";
import mockTestReducer from "./slices/mockTestSlice";
import uiReducer from "./slices/uiSlice";
import educatorReducer from "./slices/educatorSlice";
import studentLibraryReducer from "./slices/studentLibrarySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: courseReducer,
    mockTest: mockTestReducer,
    ui: uiReducer,
    educator: educatorReducer,
    studentLibrary: studentLibraryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "auth/setUser",
          "auth/registerUser/fulfilled",
          "auth/loginUser/fulfilled",
          "auth/googleLogin/fulfilled",
        ],
        ignoredPaths: ["auth.user"],
      },
    }),
});

export default store;
