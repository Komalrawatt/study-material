import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllTests,
  getTestById,
  getTestQuestions,
  submitTestResult,
  getUserResults,
} from "@/services/mockTestService";

const getLocalResultsKey = (userId) => `mockTestResults:${userId}`;

const loadLocalResults = (userId) => {
  if (!userId) return [];
  try {
    const raw = localStorage.getItem(getLocalResultsKey(userId));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveLocalResults = (userId, results) => {
  if (!userId) return;
  try {
    localStorage.setItem(getLocalResultsKey(userId), JSON.stringify(results));
  } catch {
    // Ignore storage errors (quota, privacy mode, etc.).
  }
};

export const fetchAllTests = createAsyncThunk(
  "mockTest/fetchAllTests",
  async (_, { rejectWithValue }) => {
    try {
      return await getAllTests();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTestDetail = createAsyncThunk(
  "mockTest/fetchTestDetail",
  async (testId, { rejectWithValue }) => {
    try {
      const test = await getTestById(testId);
      const questions = await getTestQuestions(testId);
      return { test, questions };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const submitTest = createAsyncThunk(
  "mockTest/submitTest",
  async (resultData, { rejectWithValue }) => {
    try {
      const resultId = await submitTestResult(resultData);
      const result = {
        id: resultId,
        ...resultData,
        createdAt: resultData.createdAt || Date.now(),
      };
      const existing = loadLocalResults(resultData.userId);
      saveLocalResults(resultData.userId, [result, ...existing]);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserResults = createAsyncThunk(
  "mockTest/fetchUserResults",
  async (userId, { rejectWithValue }) => {
    try {
      const results = await getUserResults(userId);
      if (results.length) {
        saveLocalResults(userId, results);
        return results;
      }
      return loadLocalResults(userId);
    } catch (error) {
      const localFallback = loadLocalResults(userId);
      if (localFallback.length) return localFallback;
      return rejectWithValue(error.message);
    }
  }
);

const mockTestSlice = createSlice({
  name: "mockTest",
  initialState: {
    tests: [],
    currentTest: null,
    questions: [],
    currentQuestionIndex: 0,
    answers: {},
    results: [],
    currentResult: null,
    timeRemaining: 0,
    isTestActive: false,
    loading: false,
    error: null,
  },
  reducers: {
    setAnswer: (state, action) => {
      const { questionId, answer } = action.payload;
      state.answers[questionId] = answer;
    },
    nextQuestion: (state) => {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1;
      }
    },
    prevQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
      }
    },
    goToQuestion: (state, action) => {
      state.currentQuestionIndex = action.payload;
    },
    startTest: (state, action) => {
      state.isTestActive = true;
      state.timeRemaining = action.payload * 60; // convert minutes to seconds
      state.answers = {};
      state.currentQuestionIndex = 0;
    },
    decrementTimer: (state) => {
      if (state.timeRemaining > 0) {
        state.timeRemaining -= 1;
      }
    },
    endTest: (state) => {
      state.isTestActive = false;
    },
    clearTest: (state) => {
      state.currentTest = null;
      state.questions = [];
      state.currentQuestionIndex = 0;
      state.answers = {};
      state.currentResult = null;
      state.timeRemaining = 0;
      state.isTestActive = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllTests.fulfilled, (state, action) => {
        state.loading = false;
        state.tests = action.payload;
      })
      .addCase(fetchAllTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTestDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTestDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTest = action.payload.test;
        state.questions = action.payload.questions;
      })
      .addCase(fetchTestDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(submitTest.fulfilled, (state, action) => {
        state.currentResult = action.payload;
        state.isTestActive = false;
        state.results = [action.payload, ...state.results];
      })
      .addCase(fetchUserResults.fulfilled, (state, action) => {
        state.results = action.payload;
      });
  },
});

export const {
  setAnswer,
  nextQuestion,
  prevQuestion,
  goToQuestion,
  startTest,
  decrementTimer,
  endTest,
  clearTest,
} = mockTestSlice.actions;
export default mockTestSlice.reducer;
