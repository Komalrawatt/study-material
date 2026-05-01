import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCourses,
  getCourseById,
  enrollInCourse,
  unenrollFromCourse,
  getEnrolledCourses,
  searchCourses,
  getCourseReviews,
} from "@/services/courseService";

export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (_, { rejectWithValue }) => {
    try {
      return await getCourses();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCourseDetail = createAsyncThunk(
  "courses/fetchCourseDetail",
  async (courseId, { rejectWithValue }) => {
    try {
      const course = await getCourseById(courseId);
      if (!course) {
        return { course: null, materials: [], reviews: [] };
      }

      let reviews = [];
      try {
        reviews = await getCourseReviews(courseId);
      } catch (reviewError) {
        console.warn("Failed to load reviews for course:", reviewError?.message || reviewError);
      }

      return { course, materials: [], reviews };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchEnrolledCourses = createAsyncThunk(
  "courses/fetchEnrolledCourses",
  async (courseIds, { rejectWithValue }) => {
    try {
      return await getEnrolledCourses(courseIds);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const enrollCourse = createAsyncThunk(
  "courses/enrollCourse",
  async ({ userId, courseId }, { rejectWithValue, getState }) => {
    try {
      const role = getState()?.auth?.user?.role;
      if (role === "educator") {
        throw new Error("Educators cannot enroll in courses");
      }
      await enrollInCourse(userId, courseId);
      return courseId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const unenrollCourse = createAsyncThunk(
  "courses/unenrollCourse",
  async ({ userId, courseId }, { rejectWithValue }) => {
    try {
      await unenrollFromCourse(userId, courseId);
      return courseId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchCoursesAction = createAsyncThunk(
  "courses/searchCourses",
  async (searchTerm, { rejectWithValue }) => {
    try {
      return await searchCourses(searchTerm);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const courseSlice = createSlice({
  name: "courses",
  initialState: {
    courses: [],
    enrolledCourses: [],
    currentCourse: null,
    materials: [],
    reviews: [],
    searchResults: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentCourse: (state) => {
      state.currentCourse = null;
      state.materials = [];
      state.reviews = [];
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch courses
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch course detail
      .addCase(fetchCourseDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourseDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload.course;
        state.materials = action.payload.materials;
        state.reviews = action.payload.reviews;
      })
      .addCase(fetchCourseDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Enrolled courses
      .addCase(fetchEnrolledCourses.fulfilled, (state, action) => {
        state.enrolledCourses = action.payload;
      })
      // Enroll
      .addCase(enrollCourse.fulfilled, (state, action) => {
        const course = state.courses.find((c) => c.id === action.payload);
        const alreadyEnrolled = state.enrolledCourses.some((c) => c.id === action.payload);
        if (course && !alreadyEnrolled) {
          state.enrolledCourses.push(course);
        }
      })
      // Unenroll
      .addCase(unenrollCourse.fulfilled, (state, action) => {
        state.enrolledCourses = state.enrolledCourses.filter(
          (c) => c.id !== action.payload
        );
      })
      // Search
      .addCase(searchCoursesAction.fulfilled, (state, action) => {
        state.searchResults = action.payload;
      });
  },
});

export const { clearCurrentCourse, clearSearchResults } = courseSlice.actions;
export default courseSlice.reducer;
