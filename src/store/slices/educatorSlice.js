import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getEducatorCourses,
  createCourse as createCourseService,
  updateCourse as updateCourseService,
  deleteCourse as deleteCourseService,
  getEducatorMaterials,
  addMaterial as addMaterialService,
  deleteMaterial as deleteMaterialService,
  getEducatorStats,
} from "@/services/educatorService";

export const fetchEducatorData = createAsyncThunk(
  "educator/fetchData",
  async (educatorId, { rejectWithValue }) => {
    try {
      const stats = await getEducatorStats(educatorId);
      return stats;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCourse = createAsyncThunk(
  "educator/createCourse",
  async (courseData, { rejectWithValue }) => {
    try {
      const course = await createCourseService(courseData);
      return course;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const editCourse = createAsyncThunk(
  "educator/editCourse",
  async ({ courseId, data }, { rejectWithValue }) => {
    try {
      await updateCourseService(courseId, data);
      return { id: courseId, ...data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeCourse = createAsyncThunk(
  "educator/removeCourse",
  async (courseId, { rejectWithValue }) => {
    try {
      await deleteCourseService(courseId);
      return courseId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addNewMaterial = createAsyncThunk(
  "educator/addMaterial",
  async (materialData, { rejectWithValue }) => {
    try {
      const material = await addMaterialService(materialData);
      return material;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeMaterial = createAsyncThunk(
  "educator/removeMaterial",
  async (materialId, { rejectWithValue }) => {
    try {
      await deleteMaterialService(materialId);
      return materialId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const educatorSlice = createSlice({
  name: "educator",
  initialState: {
    courses: [],
    materials: [],
    stats: {
      totalCourses: 0,
      totalMaterials: 0,
      totalStudents: 0,
      avgRating: 0,
      ratingsCount: 0,
    },
    loading: false,
    error: null,
  },
  reducers: {
    clearEducatorError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch educator data
      .addCase(fetchEducatorData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEducatorData.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.courses;
        state.materials = action.payload.materials;
        state.stats = {
          totalCourses: action.payload.totalCourses,
          totalMaterials: action.payload.totalMaterials,
          totalStudents: action.payload.totalStudents,
          avgRating: action.payload.avgRating,
          ratingsCount: action.payload.ratingsCount,
        };
      })
      .addCase(fetchEducatorData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create course
      .addCase(createCourse.fulfilled, (state, action) => {
        state.courses.unshift(action.payload);
        state.stats.totalCourses += 1;
      })
      // Edit course
      .addCase(editCourse.fulfilled, (state, action) => {
        state.courses = state.courses.map((course) =>
          course.id === action.payload.id
            ? {
                ...course,
                ...action.payload,
              }
            : course
        );
      })
      // Remove course
      .addCase(removeCourse.fulfilled, (state, action) => {
        state.courses = state.courses.filter((c) => c.id !== action.payload);
        state.stats.totalCourses -= 1;
      })
      // Add material
      .addCase(addNewMaterial.fulfilled, (state, action) => {
        state.materials.unshift(action.payload);
        state.stats.totalMaterials += 1;
      })
      // Remove material
      .addCase(removeMaterial.fulfilled, (state, action) => {
        state.materials = state.materials.filter((m) => m.id !== action.payload);
        state.stats.totalMaterials -= 1;
      });
  },
});

export const { clearEducatorError } = educatorSlice.actions;
export default educatorSlice.reducer;
